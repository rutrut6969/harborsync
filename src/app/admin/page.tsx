import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addAuthorizedEmail, approveApplication, denyApplication, updateAuthorizedEmailStatus } from "@/app/actions/admin";

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { platformRole: true } });
  if (admin?.platformRole !== "PLATFORM_ADMIN") redirect("/");

  const params = await searchParams;
  const q = params?.q?.trim();
  const whereText = q ? { contains: q, mode: "insensitive" as const } : undefined;

  const [applications, users, authorizedEmails, families, children, cases, organizations, invites, audits] = await Promise.all([
    prisma.application.findMany({ where: { status: { in: ["PENDING", "NEEDS_REVIEW"] } }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.user.findMany({ where: q ? { OR: [{ email: whereText }, { name: whereText }] } : undefined, orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.authorizedEmail.findMany({ where: q ? { OR: [{ email: whereText }, { name: whereText }] } : undefined, orderBy: { updatedAt: "desc" }, take: 50 }),
    prisma.familyGroup.findMany({ where: q ? { name: whereText } : undefined, include: { children: true, memberships: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.childProfile.findMany({ where: q ? { fullName: whereText } : undefined, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.case.findMany({ where: q ? { title: whereText } : undefined, include: { children: true, participants: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.organization.findMany({ where: q ? { name: whereText } : undefined, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.invitation.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 })
  ]);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-slate-deep">
      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <p className="text-sm font-medium text-teal-soft">Platform admin</p>
          <h1 className="text-3xl font-semibold">HarborSync Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Approve access, review applications, monitor families, and manage authorized emails.</p>
        </div>

        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search users, families, orgs, cases" className="min-h-11 flex-1 rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10" />
          <Button type="submit">Search</Button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Approved users" value={users.length} />
          <Stat title="Families" value={families.length} />
          <Stat title="Child profiles" value={children.length} />
          <Stat title="Active cases" value={cases.length} />
        </div>

        <Card>
          <SectionHeader title="Authorized Emails" />
          <form action={addAuthorizedEmail} className="grid gap-3 md:grid-cols-5">
            <input name="email" type="email" required placeholder="email@example.com" className={fieldClass} />
            <input name="name" placeholder="Name optional" className={fieldClass} />
            <select name="defaultRole" className={fieldClass} defaultValue="READ_ONLY">
              {["FAMILY_ADMIN", "FAMILY_MEMBER", "CAREGIVER", "CPS_CASEWORKER", "ADVOCATE", "READ_ONLY"].map((role) => <option key={role}>{role}</option>)}
            </select>
            <select name="accountType" className={fieldClass} defaultValue="FAMILY">
              {["FAMILY", "CAREGIVER", "CASEWORKER", "ADVOCATE", "ORGANIZATION_ADMIN", "READ_ONLY"].map((type) => <option key={type}>{type}</option>)}
            </select>
            <Button type="submit">Authorize</Button>
          </form>
          <div className="mt-4 space-y-2">
            {authorizedEmails.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{item.email}</p>
                    <p className="text-sm text-slate-500">{item.name ?? "No name"} - {item.defaultRole} - {item.accountType}</p>
                  </div>
                  <form action={updateAuthorizedEmailStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <select name="status" className="rounded-2xl border border-border bg-white px-3 text-xs font-semibold" defaultValue={item.status}>
                      {["AUTHORIZED", "INVITED", "ACTIVE", "SUSPENDED", "REVOKED"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <button type="submit" className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">Update</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <AdminList title="Pending Applications" items={applications.map((item) => ({
            id: item.id,
            title: item.name ?? item.email,
            detail: `${item.type} - ${item.status} - ${item.organizationName ?? "No org"}`,
            actions: (
              <div className="flex gap-2">
                <form action={approveApplication}><input type="hidden" name="id" value={item.id} /><button className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">Approve</button></form>
                <form action={denyApplication}><input type="hidden" name="id" value={item.id} /><button className="touch-target rounded-2xl bg-[#fff5f5] px-3 text-xs font-semibold text-error-muted">Deny</button></form>
              </div>
            )
          }))} />
          <AdminList title="Organizations" items={organizations.map((item) => ({ id: item.id, title: item.name, detail: `${item.type} - ${item.status}` }))} />
          <AdminList title="Families" items={families.map((item) => ({ id: item.id, title: item.name, detail: `${item.memberships.length} adults - ${item.children.length} children` }))} />
          <AdminList title="Cases" items={cases.map((item) => ({ id: item.id, title: item.title, detail: `${item.status} - ${item.participants.length} participants` }))} />
          <AdminList title="Invite Activity" items={invites.map((item) => ({ id: item.id, title: item.email, detail: `${item.role} - ${item.status}` }))} />
          <AdminList title="Recent Audit Logs" items={audits.map((item) => ({ id: item.id, title: item.message, detail: `${item.action} - ${item.createdAt.toLocaleString()}` }))} />
        </div>
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return <Card><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-slate-500">{title}</p></Card>;
}

function AdminList({ title, items }: { title: string; items: Array<{ id: string; title: string; detail: string; actions?: React.ReactNode }> }) {
  return (
    <Card>
      <SectionHeader title={title} />
      <div className="space-y-2">
        {items.length ? items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-[#f8fafc] p-3">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">{item.detail}</p></div>
              {item.actions}
            </div>
          </div>
        )) : <p className="rounded-2xl bg-[#f8fafc] p-3 text-sm text-slate-500">Nothing needs attention.</p>}
      </div>
    </Card>
  );
}

const fieldClass = "min-h-11 rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
