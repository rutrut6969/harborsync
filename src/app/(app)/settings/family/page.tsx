import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFamilyGroup, removeFamilyMember, updateFamilyGroup, updateFamilyMemberRole } from "@/app/actions/family";

export default async function FamilySettingsPage() {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Family management</p>
        <h1 className="text-2xl font-semibold">Family Groups</h1>
      </div>
      <Card>
        <SectionHeader title="Create Family Group" />
        <form action={createFamilyGroup} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input name="name" required placeholder="Family group name" className={fieldClass} />
          <input name="description" placeholder="Description optional" className={fieldClass} />
          <Button type="submit">Create</Button>
        </form>
      </Card>
      {profile.familyMemberships.map((membership) => (
        <Card key={membership.familyGroupId}>
          <SectionHeader title={membership.familyGroup.name} />
          <form action={updateFamilyGroup} className="mb-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input type="hidden" name="familyGroupId" value={membership.familyGroupId} />
            <input name="name" defaultValue={membership.familyGroup.name} className={fieldClass} />
            <input name="description" defaultValue={membership.familyGroup.description ?? ""} className={fieldClass} />
            <Button type="submit" variant="secondary">Save</Button>
          </form>
          <div className="space-y-3">
            {membership.familyGroup.memberships.map((member) => (
              <div key={member.id} className="rounded-2xl bg-[#f8fafc] p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{member.user.name ?? member.user.email}</p>
                    <p className="text-sm text-slate-500">{member.user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={updateFamilyMemberRole} className="flex gap-2">
                      <input type="hidden" name="membershipId" value={member.id} />
                      <select name="role" defaultValue={member.role} className="rounded-2xl border border-border bg-white px-3 text-xs font-semibold">
                        {["FAMILY_ADMIN", "FAMILY_MEMBER", "CAREGIVER", "CPS_CASEWORKER", "ADVOCATE", "READ_ONLY"].map((role) => <option key={role}>{role}</option>)}
                      </select>
                      <button className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-xs font-semibold text-harbor">Update</button>
                    </form>
                    <form action={removeFamilyMember}>
                      <input type="hidden" name="membershipId" value={member.id} />
                      <button className="touch-target rounded-2xl bg-[#fff5f5] px-3 text-xs font-semibold text-error-muted">Remove</button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

const fieldClass = "min-h-11 rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
