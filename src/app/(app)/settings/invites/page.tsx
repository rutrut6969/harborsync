import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inviteUser, resendInvite, revokeInvite } from "@/app/actions/invitations";

export default async function InvitesSettingsPage() {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");
  const baseUrl = (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Access management</p>
        <h1 className="text-2xl font-semibold">Invitations</h1>
        <p className="mt-1 text-sm text-slate-500">Invite caregivers, family members, advocates, and caseworkers only to the access they need.</p>
      </div>
      <Card>
        <SectionHeader title="Send Invite" />
        <form action={inviteUser} className="grid gap-3 md:grid-cols-2">
          <Label title="Email">
            <input name="email" type="email" required placeholder="caseworker@example.org" className={fieldClass} />
          </Label>
          <Label title="Role">
            <select name="role" required className={fieldClass} defaultValue="CAREGIVER">
              <option value="FAMILY_MEMBER">Family Member</option>
              <option value="CAREGIVER">Caregiver</option>
              <option value="CPS_CASEWORKER">CPS Caseworker</option>
              <option value="ADVOCATE">Advocate</option>
              <option value="READ_ONLY">Read Only</option>
            </select>
          </Label>
          <Label title="Family group">
            <select name="familyGroupId" className={fieldClass} defaultValue={profile.familyMemberships[0]?.familyGroupId ?? ""}>
              <option value="">No family access</option>
              {profile.familyMemberships.map((membership) => (
                <option key={membership.familyGroupId} value={membership.familyGroupId}>
                  {membership.familyGroup.name}
                </option>
              ))}
            </select>
          </Label>
          <Label title="Case access">
            <select name="caseId" className={fieldClass} defaultValue="">
              <option value="">No case access</option>
              {profile.caseParticipants.map((participant) => (
                <option key={participant.caseId} value={participant.caseId}>
                  {participant.case.title}
                </option>
              ))}
            </select>
          </Label>
          <Label title="Organization">
            <select name="organizationId" className={fieldClass} defaultValue="">
              <option value="">No organization access</option>
              {profile.organizationMemberships.map((membership) => (
                <option key={membership.organizationId} value={membership.organizationId}>
                  {membership.organization.name}
                </option>
              ))}
            </select>
          </Label>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Send invite
            </Button>
          </div>
        </form>
      </Card>
      <Card>
        <SectionHeader title="Pending And Recent Invites" />
        <div className="space-y-3">
          {profile.invitations.length ? (
            profile.invitations.map((invite) => (
              <div key={invite.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{invite.email}</p>
                    <p className="text-sm text-slate-500">
                      {toTitle(invite.role)} - {invite.familyGroup?.name ?? invite.case?.title ?? invite.organization?.name ?? "General access"}
                    </p>
                    <p className="mt-2 break-all rounded-xl bg-white px-3 py-2 text-xs text-slate-500">
                      {baseUrl ? `${baseUrl}/invite/${invite.token}` : `/invite/${invite.token}`}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">{toTitle(invite.status)}</span>
                </div>
                {invite.status === "PENDING" ? (
                  <div className="mt-3 flex gap-2">
                    <form action={resendInvite}>
                      <input type="hidden" name="invitationId" value={invite.id} />
                      <button type="submit" className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">
                        Resend
                      </button>
                    </form>
                    <form action={revokeInvite}>
                      <input type="hidden" name="invitationId" value={invite.id} />
                      <button type="submit" className="touch-target rounded-2xl bg-[#fff5f5] px-3 text-xs font-semibold text-error-muted">
                        Revoke
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-[#f8fafc] p-3 text-sm text-slate-500">No invites have been sent yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function Label({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      {children}
    </label>
  );
}

function toTitle(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const fieldClass =
  "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
