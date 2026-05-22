import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { ChildProfileForm } from "@/components/children/child-profile-form";
import { createChildProfile } from "@/app/actions/children";

export default async function NewChildPage() {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");
  const families = profile.familyMemberships
    .filter((membership) => membership.role === "FAMILY_ADMIN")
    .map((membership) => ({ id: membership.familyGroupId, name: membership.familyGroup.name }));

  return (
    <div className="space-y-5">
      <BackButton />
      <div>
        <p className="text-sm font-medium text-teal-soft">Child management</p>
        <h1 className="text-2xl font-semibold">Add Child Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Create a managed profile for health logs, documents, cases, and approved sharing.</p>
      </div>
      <Card>
        <SectionHeader title="Child Information" />
        <ChildProfileForm action={createChildProfile} families={families} submitLabel="Create child profile" />
      </Card>
    </div>
  );
}
