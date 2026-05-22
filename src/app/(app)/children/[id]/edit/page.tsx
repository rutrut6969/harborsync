import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getChildForUser, getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { ChildProfileForm } from "@/components/children/child-profile-form";
import { archiveChildProfile, updateChildProfile } from "@/app/actions/children";

export default async function EditChildPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const child = await getChildForUser(session?.user?.id ?? "", id);
  if (!child) notFound();
  const profile = await getProfileData(session?.user?.id ?? "");
  const canEdit = profile.familyMemberships.some(
    (membership) => membership.role === "FAMILY_ADMIN" && membership.familyGroup.children.some((familyChild) => familyChild.childId === child.id)
  );

  return (
    <div className="space-y-5">
      <BackButton />
      <div>
        <p className="text-sm font-medium text-teal-soft">Child management</p>
        <h1 className="text-2xl font-semibold">Edit {child.fullName}</h1>
        <p className="mt-1 text-sm text-slate-500">Update care information, emergency contacts, notes, and caseworker details.</p>
      </div>
      <Card>
        <SectionHeader title="Profile Details" />
        {canEdit ? (
          <ChildProfileForm action={updateChildProfile} child={child} submitLabel="Save child profile" />
        ) : (
          <p className="rounded-2xl bg-[#fffaf0] p-3 text-sm font-medium text-[#9a6a23]">You can view this child profile, but only a family admin can edit it.</p>
        )}
      </Card>
      {canEdit && !child.archivedAt ? (
        <Card className="border-[#f3d4d4] bg-[#fffafa]">
          <SectionHeader title="Archive Profile" />
          <p className="text-sm text-slate-600">Archiving hides the profile from active management without deleting historical records.</p>
          <form action={archiveChildProfile} className="mt-3">
            <input type="hidden" name="childId" value={child.id} />
            <button type="submit" className="touch-target rounded-2xl border border-[#f1cdcd] bg-white px-4 text-sm font-semibold text-error-muted">
              Archive child profile
            </button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
