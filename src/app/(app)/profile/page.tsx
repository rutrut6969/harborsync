import { format, intervalToDuration } from "date-fns";
import {
  Activity,
  AlertCircle,
  Baby,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileText,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");
  const primaryRole = profile.familyMemberships[0]?.role ?? profile.organizationMemberships[0]?.role ?? "READ_ONLY";
  const familyName = profile.familyMemberships[0]?.familyGroup.name ?? "No family group yet";
  const organizationName = profile.organizationMemberships[0]?.organization.name;
  const relationshipCards = profile.familyMemberships.flatMap((membership) =>
    membership.familyGroup.memberships.map((familyMember) => (
      <RelationshipCard
        key={familyMember.id}
        name={familyMember.user.name ?? familyMember.user.email}
        relationship={familyMember.userId === session?.user?.id ? "You" : "Family member"}
        role={toTitle(familyMember.role)}
        access="Family access"
        newCount={familyMember.userId === session?.user?.id ? 0 : 1}
      />
    ))
  );

  return (
    <div className="space-y-5">
      <ProfileHeader
        name={profile.user?.name ?? session?.user?.name ?? "HarborSync user"}
        email={profile.user?.email ?? session?.user?.email ?? ""}
        image={profile.user?.image ?? session?.user?.image}
        primaryRole={toTitle(primaryRole)}
        familyName={familyName}
        organizationName={organizationName}
        accountStatus={profile.user?.emailVerified ? "Verified" : "Approved"}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-5">
          <Card>
            <SectionHeader title="Recent Updates" />
            <div className="space-y-3">
              {profile.recentUpdates.length ? (
                profile.recentUpdates.map((update) => (
                  <UpdateItem
                    key={`${update.type}-${update.id}`}
                    icon={iconForUpdate(update.type)}
                    title={update.title}
                    description={update.description}
                    timestamp={update.timestamp}
                    related={update.related}
                    status={update.status}
                  />
                ))
              ) : (
                <EmptyState
                  compact
                  icon={Activity}
                  title="No recent updates yet"
                  description="Medication logs, documents, case activity, and follow-ups will appear here."
                />
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Child Quick Access" />
            <div className="grid gap-3 lg:grid-cols-2">
              {profile.childSummaries.length ? (
                profile.childSummaries.map((child) => (
                  <a key={child.id} href={`/children/${child.id}`} className="block rounded-2xl border border-slate-100 p-4 transition hover:border-[#c9d7e5] hover:bg-[#f8fbfd]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f1f8] text-sm font-bold text-harbor">
                          {initials(child.fullName)}
                        </div>
                        <div>
                          <p className="font-semibold">{child.fullName}</p>
                          <p className="text-sm text-slate-500">
                            DOB {format(child.dateOfBirth, "MMM d, yyyy")} {ageLabel(child.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                      {child.newCount ? <NewBadge count={child.newCount} /> : null}
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                      <InfoLine label="Allergies" value={child.allergies ?? "None listed"} />
                      <InfoLine label="Conditions" value={child.conditions ?? "None listed"} />
                      <InfoLine label="Medications" value={child.currentMedications ?? "None listed"} />
                      <InfoLine label="Doctor" value={child.primaryDoctor ?? "Not listed"} />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-teal-soft">Latest activity: {child.latestActivity}</p>
                  </a>
                ))
              ) : (
                <EmptyState compact icon={Baby} title="No child profiles yet" description="Approved child profiles will show up here." />
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Connections" />
            <div className="grid gap-3 md:grid-cols-3">
              <ConnectionSummary icon={UsersRound} title="Family Groups" value={profile.familyMemberships.length} detail={profile.familyMemberships.map((item) => item.familyGroup.name).join(", ") || "None connected"} />
              <ConnectionSummary icon={ShieldCheck} title="Active Cases" value={profile.caseParticipants.length} detail={profile.caseParticipants.map((item) => item.case.title).join(", ") || "No active cases"} />
              <ConnectionSummary icon={Building2} title="Organizations" value={profile.organizationMemberships.length} detail={profile.organizationMemberships.map((item) => item.organization.name).join(", ") || "No organization access"} />
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <SectionHeader title="Family Relationships" />
            <div className="space-y-3">
              {relationshipCards.length ? (
                relationshipCards
              ) : (
                <EmptyState compact icon={UsersRound} title="No relationships yet" description="Family members, caregivers, advocates, and caseworkers will appear here." />
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Important Information" />
            <div className="space-y-3">
              <ImportantItem icon={AlertCircle} label="Emergency contacts" value={`${profile.children.filter((child) => child.emergencyContacts).length} child profiles have contacts listed`} />
              <ImportantItem icon={ShieldCheck} label="Permissions summary" value={`${profile.familyMemberships.length + profile.caseParticipants.length + profile.organizationMemberships.length} access relationships`} />
              <ImportantItem icon={CalendarClock} label="Pending invites" value={`${profile.invitations.filter((invite) => invite.status === "PENDING").length} pending`} />
              <ImportantItem icon={FileText} label="Documents needing review" value="Review queue placeholder" />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ProfileHeader({
  name,
  email,
  image,
  primaryRole,
  familyName,
  organizationName,
  accountStatus
}: {
  name: string;
  email: string;
  image?: string | null;
  primaryRole: string;
  familyName: string;
  organizationName?: string;
  accountStatus: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-[linear-gradient(135deg,#e8f1f8,#eef8f6)] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="size-16 rounded-3xl object-cover shadow-sm" />
            ) : (
              <div className="grid size-16 place-items-center rounded-3xl bg-harbor text-xl font-bold text-white shadow-sm">
                {initials(name || email)}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-teal-soft">Profile</p>
              <h1 className="text-2xl font-semibold text-slate-deep">{name}</h1>
              <p className="text-sm text-slate-600">{email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill>{primaryRole}</Pill>
            <Pill>{familyName}</Pill>
            {organizationName ? <Pill>{organizationName}</Pill> : null}
            <Pill>{accountStatus}</Pill>
            <Pill>Last active: Today</Pill>
          </div>
        </div>
      </div>
    </Card>
  );
}

function UpdateItem({ icon: Icon, title, description, timestamp, related, status }: { icon: LucideIcon; title: string; description: string; timestamp: string; related: string; status: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 p-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#eef8f6] text-teal-soft">
        <Icon size={19} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{title}</p>
          <span className="rounded-full bg-[#f4f8fb] px-2 py-0.5 text-xs font-semibold text-slate-500">{status}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <p className="mt-2 text-xs font-semibold text-harbor">{related} - {timestamp}</p>
      </div>
    </div>
  );
}

function RelationshipCard({ name, relationship, role, access, newCount }: { name: string; relationship: string; role: string; access: string; newCount: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
      <div className="grid size-10 place-items-center rounded-2xl bg-[#e8f1f8] text-sm font-bold text-harbor">{initials(name)}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{name}</p>
        <p className="text-xs text-slate-500">{relationship} - {role} - {access}</p>
      </div>
      {newCount ? <NewBadge count={newCount} /> : null}
    </div>
  );
}

function ConnectionSummary({ icon: Icon, title, value, detail }: { icon: LucideIcon; title: string; value: number; detail: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fafc] p-4">
      <Icon className="mb-3 text-harbor" size={22} aria-hidden />
      <p className="text-2xl font-semibold">{value}</p>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function ImportantItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#f8fafc] p-3">
      <Icon className="shrink-0 text-harbor" size={19} aria-hidden />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-slate-deep">{label}:</span> {value}
    </p>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">{children}</span>;
}

function NewBadge({ count }: { count: number }) {
  return <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-bold text-harbor">+{count} new</span>;
}

function iconForUpdate(type: string) {
  if (type === "Medication") return HeartPulse;
  if (type === "Bloodwork") return Activity;
  if (type === "Doctor Visit") return Stethoscope;
  if (type === "Document") return FileText;
  return CheckCircle2;
}

function initials(value: string) {
  return value
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function toTitle(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ageLabel(dateOfBirth: Date) {
  const duration = intervalToDuration({ start: dateOfBirth, end: new Date() });
  if (duration.years) return `(${duration.years}y)`;
  if (duration.months) return `(${duration.months}m)`;
  return "";
}
