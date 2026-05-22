import { Building2, ShieldCheck, UsersRound } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function OrganizationAccessPage() {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Organization access</p>
        <h1 className="text-2xl font-semibold">Organizations</h1>
        <p className="mt-1 text-sm text-slate-500">Review approved organizations, assigned roles, case access, and sponsorship context.</p>
      </div>

      <Card>
        <SectionHeader title="Connected Organizations" />
        <div className="space-y-3">
          {profile.organizationMemberships.length ? (
            profile.organizationMemberships.map((membership) => (
              <div key={membership.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f1f8] text-harbor">
                      <Building2 size={20} aria-hidden />
                    </div>
                    <div>
                      <p className="font-semibold">{membership.organization.name}</p>
                      <p className="text-sm text-slate-500">{toTitle(membership.organization.type)} - {toTitle(membership.role)}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">
                    {membership.isSeatActive ? "Active seat" : "Approval pending"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Domain: {membership.organization.approvedDomain ?? "Manual approval"} - Status: {toTitle(membership.organization.status)}
                </p>
              </div>
            ))
          ) : (
            <EmptyState compact icon={Building2} title="No organization access yet" description="Approved organization memberships and sponsored support will appear here." />
          )}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Assigned Cases" />
          <div className="space-y-3">
            {profile.caseParticipants.length ? (
              profile.caseParticipants.map((participant) => (
                <div key={participant.id} className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{participant.case.title}</p>
                    <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">{participant.case.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {participant.case.children.map((child) => child.child.fullName).join(", ")}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState compact icon={ShieldCheck} title="No assigned cases" description="Case assignments will be shown here when access is granted." />
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Access Model" />
          <div className="space-y-3">
            <AccessLine icon={UsersRound} title="Relationship based" text="Access is granted per family, child, organization, or case relationship." />
            <AccessLine icon={ShieldCheck} title="Approval gated" text="Organization domains can help route requests, but activation remains approval controlled." />
            <AccessLine icon={Building2} title="Sponsorship ready" text="The data model supports family sponsorships and assigned professional support." />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AccessLine({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#f8fafc] p-3">
      <Icon className="shrink-0 text-harbor" size={19} aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function toTitle(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
