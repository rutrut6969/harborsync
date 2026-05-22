import Link from "next/link";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";

export default async function ChildrenSettingsPage() {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-teal-soft">Child management</p>
          <h1 className="text-2xl font-semibold">Child Profiles</h1>
        </div>
        <Link href="/children/new" className="touch-target rounded-2xl bg-harbor px-4 py-2.5 text-sm font-semibold text-white">Add child</Link>
      </div>
      <Card>
        <SectionHeader title="Managed Profiles" />
        <div className="grid gap-3 md:grid-cols-2">
          {profile.childSummaries.length ? profile.childSummaries.map((child) => (
            <Link key={child.id} href={`/children/${child.id}/edit`} className="rounded-2xl border border-slate-100 p-4 transition hover:border-[#c9d7e5] hover:bg-[#f8fbfd]">
              <p className="font-semibold">{child.fullName}</p>
              <p className="text-sm text-slate-500">DOB {child.dateOfBirth.toLocaleDateString()}</p>
              <p className="mt-2 text-xs font-semibold text-teal-soft">{child.archivedAt ? "Archived" : "Active"}</p>
            </Link>
          )) : <p className="rounded-2xl bg-[#f8fafc] p-3 text-sm text-slate-500">No child profiles yet.</p>}
        </div>
      </Card>
    </div>
  );
}
