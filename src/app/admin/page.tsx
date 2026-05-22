import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  addAuthorizedEmail,
  approveApplication,
  createAdminAccount,
  denyApplication,
  updateAuthorizedEmail,
  updateAuthorizedEmailStatus,
  updatePlatformRole
} from "@/app/actions/admin";

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; error?: string; authorized?: string; admin?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { platformRole: true } });
  if (admin?.platformRole !== "SUPER_ADMIN" && admin?.platformRole !== "PLATFORM_ADMIN") redirect("/");
  const isSuperAdmin = admin.platformRole === "SUPER_ADMIN";

  const params = await searchParams;
  const q = params?.q?.trim();
  const text = q ? { contains: q, mode: "insensitive" as const } : undefined;

  const [applications, users, authorizedEmails, families, children, cases, organizations, invites, audits, pendingRelationships] = await Promise.all([
    prisma.application.findMany({ where: q ? { OR: [{ email: text }, { name: text }, { organizationName: text }] } : undefined, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.user.findMany({
      where: q ? { OR: [{ email: text }, { name: text }] } : undefined,
      include: {
        authorizedEmail: true,
        familyMemberships: { include: { familyGroup: true } },
        childPermissions: { include: { child: true } },
        caseParticipants: { include: { case: true } },
        organizationMemberships: { include: { organization: true } },
        sentInvitations: { orderBy: { createdAt: "desc" }, take: 5 }
      },
      orderBy: { createdAt: "desc" },
      take: 75
    }),
    prisma.authorizedEmail.findMany({ where: q ? { OR: [{ email: text }, { name: text }] } : undefined, include: { organization: true }, orderBy: { updatedAt: "desc" }, take: 75 }),
    prisma.familyGroup.findMany({
      where: q ? { name: text } : undefined,
      include: {
        memberships: { include: { user: true } },
        children: { include: { child: true } },
        sponsorships: { include: { organization: true } },
        invitations: true
      },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.childProfile.findMany({
      where: q ? { fullName: text } : undefined,
      include: {
        families: { include: { familyGroup: true } },
        cases: { include: { case: true } },
        relationships: { include: { user: true, familyGroup: true, case: true, organization: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.case.findMany({
      where: q ? { title: text } : undefined,
      include: {
        sponsoringOrganization: true,
        children: { include: { child: true } },
        participants: { include: { user: true } },
        invitations: true,
        timeline: { orderBy: { createdAt: "desc" }, take: 5 }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.organization.findMany({
      where: q ? { name: text } : undefined,
      include: { memberships: true, sponsoredCases: true, sponsorships: true, applications: true, authorizedEmails: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.invitation.findMany({ include: { sender: true, familyGroup: true, case: true, organization: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.childRelationship.findMany({
      where: { status: { in: ["PENDING_APPROVAL", "INVITED"] } },
      include: { child: true, user: true, familyGroup: true, case: true, organization: true },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);

  const orphanedChildren = children.filter((child) => !child.relationships.some((rel) => rel.status === "ACTIVE" && ["PARENT_GUARDIAN", "FOSTER_PARENT"].includes(rel.relationshipType)));
  const suspendedUsers = users.filter((user) => user.authorizedEmail?.status === "SUSPENDED" || user.authorizedEmail?.status === "REVOKED");

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-slate-deep">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <p className="text-sm font-medium text-teal-soft">System access</p>
          <h1 className="text-3xl font-semibold">HarborSync Admin Console</h1>
          <p className="mt-1 text-sm text-slate-500">System metadata, approvals, invites, and access controls. Private health log details stay out of this view.</p>
        </div>

        {params?.error ? <Notice tone="error">{params.error}</Notice> : null}
        {params?.authorized || params?.admin ? <Notice tone="success">Admin change saved.</Notice> : null}

        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search users, families, orgs, cases" className={fieldClass} />
          <Button type="submit">Search</Button>
        </form>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Active users" value={users.length} />
          <Stat title="Authorized emails" value={authorizedEmails.length} />
          <Stat title="Pending applications" value={applications.filter((item) => ["PENDING", "NEEDS_REVIEW"].includes(item.status)).length} />
          <Stat title="Families" value={families.length} />
          <Stat title="Child profiles" value={children.length} />
          <Stat title="Cases" value={cases.length} />
          <Stat title="Organizations" value={organizations.length} />
          <Stat title="Pending invites" value={invites.filter((item) => item.status === "PENDING").length} />
          <Stat title="Suspended/revoked" value={suspendedUsers.length} />
          <Stat title="Orphaned children" value={orphanedChildren.length} />
          <Stat title="Pending relationships" value={pendingRelationships.length} />
          <Stat title="Recent audit events" value={audits.length} />
        </section>

        {isSuperAdmin ? (
          <Card>
            <SectionHeader title="Admin Accounts" />
            <form action={createAdminAccount} className="grid gap-3 md:grid-cols-4">
              <input name="email" type="email" required placeholder="admin@example.com" className={fieldClass} />
              <input name="name" placeholder="Name optional" className={fieldClass} />
              <select name="platformRole" className={fieldClass} defaultValue="PLATFORM_ADMIN">
                <option value="PLATFORM_ADMIN">Platform Admin</option>
                <option value="SUPPORT_ADMIN">Support Admin</option>
              </select>
              <Button type="submit">Create Admin</Button>
            </form>
          </Card>
        ) : null}

        <Card>
          <SectionHeader title="Authorized Emails" />
          <form action={addAuthorizedEmail} className="grid gap-3 md:grid-cols-5">
            <input name="email" type="email" required placeholder="email@example.com" className={fieldClass} />
            <input name="name" placeholder="Name optional" className={fieldClass} />
            <RoleSelect name="defaultRole" defaultValue="READ_ONLY" />
            <AccountTypeSelect name="accountType" defaultValue="FAMILY" />
            <Button type="submit">Authorize</Button>
          </form>
          <div className="mt-4 space-y-2">
            {authorizedEmails.map((item) => (
              <details key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.email}</p>
                      <p className="text-sm text-slate-500">{item.name ?? "No name"} - {item.defaultRole} - {item.accountType} - {item.status}</p>
                    </div>
                    <form action={updateAuthorizedEmailStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={item.id} />
                      <StatusSelect defaultValue={item.status} />
                      <button type="submit" className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">Save Status</button>
                    </form>
                  </div>
                </summary>
                <form action={updateAuthorizedEmail} className="mt-3 grid gap-3 md:grid-cols-5">
                  <input type="hidden" name="id" value={item.id} />
                  <input name="email" defaultValue={item.email} className={fieldClass} />
                  <input name="name" defaultValue={item.name ?? ""} className={fieldClass} />
                  <RoleSelect name="defaultRole" defaultValue={item.defaultRole} />
                  <AccountTypeSelect name="accountType" defaultValue={item.accountType} />
                  <StatusSelect defaultValue={item.status} />
                  <Button type="submit" variant="secondary">Save Details</Button>
                </form>
              </details>
            ))}
          </div>
        </Card>

        <AdminSection title="Users / Accounts">
          {users.map((user) => (
            <details key={user.id} className="rounded-2xl bg-[#f8fafc] p-3">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{user.name ?? user.email}</p>
                    <p className="text-sm text-slate-500">{user.email} - {user.platformRole} - {user.authorizedEmail?.status ?? "No auth record"}</p>
                  </div>
                  <p className="text-xs font-semibold text-teal-soft">{user.onboardingCompleted ? "Onboarded" : "Incomplete"}</p>
                </div>
              </summary>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                <Meta label="Family memberships" value={user.familyMemberships.map((item) => `${item.familyGroup.name} (${item.role})`).join(", ") || "None"} />
                <Meta label="Child access" value={user.childPermissions.map((item) => item.child.fullName).join(", ") || "None"} />
                <Meta label="Cases" value={user.caseParticipants.map((item) => `${item.case.title} (${item.role})`).join(", ") || "None"} />
                <Meta label="Organizations" value={user.organizationMemberships.map((item) => `${item.organization.name} (${item.role})`).join(", ") || "None"} />
              </div>
              {isSuperAdmin ? (
                <form action={updatePlatformRole} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="userId" value={user.id} />
                  <select name="platformRole" defaultValue={user.platformRole} className="rounded-2xl border border-border bg-white px-3 text-xs font-semibold">
                    {["USER", "SUPPORT_ADMIN", "PLATFORM_ADMIN", "SUPER_ADMIN"].map((role) => <option key={role}>{role}</option>)}
                  </select>
                  <button type="submit" className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">Save Admin Role</button>
                </form>
              ) : null}
            </details>
          ))}
        </AdminSection>

        <AdminSection title="Child Profiles">
          {children.map((child) => {
            const guardians = child.relationships.filter((rel) => rel.status === "ACTIVE" && ["PARENT_GUARDIAN", "FOSTER_PARENT"].includes(rel.relationshipType));
            const caseworker = child.relationships.find((rel) => rel.status === "ACTIVE" && rel.relationshipType === "CPS_CASEWORKER");
            return (
              <details key={child.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{child.fullName}</p>
                  <p className="text-sm text-slate-500">{child.dateOfBirth.toLocaleDateString()} - {child.families.length} families - {guardians.length} guardians - caseworker {caseworker ? "assigned" : "missing"}</p>
                </summary>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <Meta label="Families" value={child.families.map((item) => item.familyGroup.name).join(", ") || "None"} />
                  <Meta label="Cases" value={child.cases.map((item) => item.case.title).join(", ") || "None"} />
                  <Meta label="Relationships" value={child.relationships.map((rel) => `${rel.fullName} (${rel.relationshipType}, ${rel.status})`).join(", ") || "None"} />
                  <Meta label="Warnings" value={!guardians.length ? "No active guardian/caretaker authority" : caseworker ? "None" : "No assigned caseworker"} />
                </div>
              </details>
            );
          })}
        </AdminSection>

        <div className="grid gap-5 lg:grid-cols-2">
          <AdminSection title="Families">
            {families.map((family) => (
              <details key={family.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{family.name}</p>
                  <p className="text-sm text-slate-500">{family.memberships.length} adults - {family.children.length} children - created {family.createdAt.toLocaleDateString()}</p>
                </summary>
                <Meta label="Adults" value={family.memberships.map((member) => `${member.user.name ?? member.user.email} (${member.role})`).join(", ") || "None"} />
                <Meta label="Children" value={family.children.map((item) => item.child.fullName).join(", ") || "None"} />
                <Meta label="Pending invites" value={family.invitations.filter((invite) => invite.status === "PENDING").map((invite) => invite.email).join(", ") || "None"} />
              </details>
            ))}
          </AdminSection>

          <AdminSection title="Cases">
            {cases.map((item) => (
              <details key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.status} - {item.sponsoringOrganization?.name ?? "No sponsor"} - {item.participants.length} participants</p>
                </summary>
                <Meta label="Children" value={item.children.map((child) => child.child.fullName).join(", ") || "None"} />
                <Meta label="Participants" value={item.participants.map((part) => `${part.user.name ?? part.user.email} (${part.role})`).join(", ") || "None"} />
                <Meta label="Timeline metadata" value={item.timeline.map((event) => event.label).join(", ") || "None"} />
              </details>
            ))}
          </AdminSection>

          <AdminSection title="Organizations">
            {organizations.map((org) => (
              <details key={org.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{org.name}</p>
                  <p className="text-sm text-slate-500">{org.type} - {org.status} - domain {org.approvedDomain ?? "manual"}</p>
                </summary>
                <Meta label="Members" value={String(org.memberships.length)} />
                <Meta label="Active cases" value={String(org.sponsoredCases.length)} />
                <Meta label="Sponsored families" value={String(org.sponsorships.length)} />
                <Meta label="Authorized emails" value={org.authorizedEmails.map((email) => email.email).join(", ") || "None"} />
              </details>
            ))}
          </AdminSection>

          <AdminSection title="Applications">
            {applications.map((item) => (
              <details key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{item.name ?? item.email}</p>
                  <p className="text-sm text-slate-500">{item.type} - {item.status} - {item.createdAt.toLocaleDateString()}</p>
                </summary>
                <Meta label="Organization" value={item.organizationName ?? "None"} />
                <Meta label="Notes" value={item.notes ?? "None"} />
                <div className="mt-3 flex gap-2">
                  <form action={approveApplication}><input type="hidden" name="id" value={item.id} /><button className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">Approve</button></form>
                  <form action={denyApplication}><input type="hidden" name="id" value={item.id} /><button className="touch-target rounded-2xl bg-[#fff5f5] px-3 text-xs font-semibold text-error-muted">Deny</button></form>
                </div>
              </details>
            ))}
          </AdminSection>

          <AdminSection title="Invitations">
            {invites.map((invite) => (
              <details key={invite.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{invite.email}</p>
                  <p className="text-sm text-slate-500">{invite.role} - {invite.status} - expires {invite.expiresAt.toLocaleDateString()}</p>
                </summary>
                <Meta label="Sender" value={invite.sender.name ?? invite.sender.email} />
                <Meta label="Target" value={invite.familyGroup?.name ?? invite.case?.title ?? invite.organization?.name ?? "General"} />
                <Meta label="Invite link token" value={invite.token} />
              </details>
            ))}
          </AdminSection>

          <AdminSection title="Relationship Requests">
            {pendingRelationships.map((item) => (
              <details key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <summary className="cursor-pointer list-none">
                  <p className="font-semibold">{item.fullName}</p>
                  <p className="text-sm text-slate-500">{item.relationshipType} - {item.status} - {item.child.fullName}</p>
                </summary>
                <Meta label="Email/user" value={item.invitedEmail ?? item.user?.email ?? "Linked manually"} />
                <Meta label="Target" value={item.familyGroup?.name ?? item.case?.title ?? item.organization?.name ?? "Child only"} />
              </details>
            ))}
          </AdminSection>

          <AdminSection title="Audit Logs">
            {audits.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="font-semibold">{item.action}</p>
                <p className="text-sm text-slate-500">{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">{item.actor?.email ?? "System"} - {item.createdAt.toLocaleString()}</p>
              </div>
            ))}
          </AdminSection>
        </div>
      </div>
    </main>
  );
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <SectionHeader title={title} />
      <div className="space-y-2">{children}</div>
    </Card>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return <Card><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-slate-500">{title}</p></Card>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <p className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-600"><span className="font-semibold text-slate-deep">{label}:</span> {value}</p>;
}

function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return <div className={tone === "success" ? "rounded-2xl border border-[#cce7d5] bg-[#f2fbf5] px-4 py-3 text-sm font-medium text-[#4d8b63]" : "rounded-2xl border border-[#f1cdcd] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-error-muted"}>{children}</div>;
}

function RoleSelect({ name, defaultValue }: { name: string; defaultValue: string }) {
  return (
    <select name={name} className={fieldClass} defaultValue={defaultValue}>
      {["FAMILY_ADMIN", "FAMILY_MEMBER", "CAREGIVER", "CPS_CASEWORKER", "ADVOCATE", "READ_ONLY"].map((role) => <option key={role}>{role}</option>)}
    </select>
  );
}

function AccountTypeSelect({ name, defaultValue }: { name: string; defaultValue: string }) {
  return (
    <select name={name} className={fieldClass} defaultValue={defaultValue}>
      {["FAMILY", "CAREGIVER", "CASEWORKER", "ADVOCATE", "ORGANIZATION_ADMIN", "READ_ONLY"].map((type) => <option key={type}>{type}</option>)}
    </select>
  );
}

function StatusSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select name="status" className="rounded-2xl border border-border bg-white px-3 text-xs font-semibold" defaultValue={defaultValue}>
      {["AUTHORIZED", "INVITED", "ACTIVE", "SUSPENDED", "REVOKED"].map((status) => <option key={status}>{status}</option>)}
    </select>
  );
}

const fieldClass = "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
