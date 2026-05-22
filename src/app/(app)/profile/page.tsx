import { Building2, KeyRound, LogOut, ShieldCheck, UsersRound } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { signOutUser } from "@/app/actions/session";
import { changePassword } from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type ProfilePageProps = {
  searchParams?: Promise<{
    passwordError?: string;
    passwordUpdated?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Account and access</p>
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-soft">Signed in as</p>
            <h2 className="mt-1 text-xl font-semibold">{session?.user?.name ?? "HarborSync user"}</h2>
            <p className="text-sm text-slate-500">{session?.user?.email}</p>
          </div>
          <form action={signOutUser}>
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
              <LogOut size={17} aria-hidden />
              Sign out
            </Button>
          </form>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f1f8] text-harbor">
            <KeyRound size={20} aria-hidden />
          </div>
          <div>
            <SectionHeader title="Password Access" />
            <p className="-mt-2 text-sm leading-6 text-slate-500">
              Use a password for faster daily sign-ins. Magic links remain available as a recovery option.
            </p>
          </div>
        </div>

        {params?.passwordError ? (
          <div className="mt-4 rounded-2xl border border-[#f1cdcd] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-error-muted">
            {params.passwordError}
          </div>
        ) : null}

        {params?.passwordUpdated ? (
          <div className="mt-4 rounded-2xl border border-[#cce7d5] bg-[#f2fbf5] px-4 py-3 text-sm font-medium text-[#4d8b63]">
            Password updated.
          </div>
        ) : null}

        <form action={changePassword} className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Current password</span>
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              className="min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10"
              placeholder="Required if set"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">New password</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              className="min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10"
              placeholder="10+ characters"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              className="min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10"
              placeholder="Repeat password"
            />
          </label>
          <div className="md:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">
              <KeyRound size={17} aria-hidden />
              Update password
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionHeader title="Relationship-Based Access" />
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl bg-[#f4f8fb] p-4">
              <item.icon className="mb-3 text-harbor" size={22} aria-hidden />
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Family Access" />
          <div className="space-y-3">
            {profile.familyMemberships.length ? (
              profile.familyMemberships.map((membership) => (
                <div key={membership.id} className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{membership.familyGroup.name}</p>
                    <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
                      {membership.role.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {membership.familyGroup.children.map((child) => child.child.fullName).join(", ")}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState compact icon={UsersRound} title="No family access yet" description="Invitations and shared child profiles will appear here." />
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Cases" />
          <div className="space-y-3">
            {profile.caseParticipants.length ? (
              profile.caseParticipants.map((participant) => (
                <div key={participant.id} className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{participant.case.title}</p>
                    <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">
                      {participant.case.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {participant.case.children.map((child) => child.child.fullName).join(", ")}
                  </p>
                  {participant.case.sponsoringOrganization ? (
                    <p className="mt-2 text-xs font-medium text-harbor">
                      Sponsored by {participant.case.sponsoringOrganization.name}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState compact icon={ShieldCheck} title="No active cases yet" description="Case participation and assigned professionals will appear here." />
            )}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Organization Registration" />
        <p className="text-sm leading-6 text-slate-500">
          Organization accounts support approved domains, inactive seats until approval, administrators,
          caseworkers, advocates, and family sponsorships. Domain-based matching can prefill requests, but
          activation remains approval gated.
        </p>
      </Card>
    </div>
  );
}

const items = [
  {
    title: "Family Groups",
    text: "Separated parents and blended families can coordinate independently.",
    icon: UsersRound
  },
  {
    title: "Case Roles",
    text: "A user can have different permissions for each child and case.",
    icon: ShieldCheck
  },
  {
    title: "Organizations",
    text: "Approved teams can sponsor families and assign professionals.",
    icon: Building2
  }
];
