import { Bell, Download, KeyRound, Mail, MapPin, ShieldCheck, Trash2, UserRound, UsersRound } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/data";
import { changePassword } from "@/app/actions/password";
import { Card, SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SettingsPageProps = {
  searchParams?: Promise<{
    passwordError?: string;
    passwordUpdated?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth();
  const profile = await getProfileData(session?.user?.id ?? "");
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Account controls</p>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage security, contact preferences, family access, and sharing controls.</p>
      </div>

      <Card id="notifications">
        <SectionHeader title="Account Information" />
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-3xl bg-[#e8f1f8] text-lg font-bold text-harbor">
            {initials(profile.user?.name ?? profile.user?.email ?? "HS")}
          </div>
          <div className="min-w-0">
            <p className="font-semibold">{profile.user?.name ?? "HarborSync user"}</p>
            <p className="truncate text-sm text-slate-500">{profile.user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{profile.familyMemberships[0]?.role ? toTitle(profile.familyMemberships[0].role) : "Approved user"}</Badge>
              <Badge>{profile.user?.passwordSetAt ? "Password active" : "Password not set"}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Contact Information" />
          <div className="grid gap-3">
            <SettingRow icon={Mail} label="Email" value={profile.user?.email ?? "Not listed"} />
            <SettingRow icon={UserRound} label="Preferred name" value={profile.user?.name ?? "Not set"} />
            <SettingRow icon={MapPin} label="Mailing address" value="Not set yet" />
            <SettingRow icon={Bell} label="Preferred contact method" value="Email" />
          </div>
        </Card>

        <Card>
          <SectionHeader title="Security" />
          <div className="space-y-3">
            {params?.passwordError ? (
              <div className="rounded-2xl border border-[#f1cdcd] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-error-muted">
                {params.passwordError}
              </div>
            ) : null}
            {params?.passwordUpdated ? (
              <div className="rounded-2xl border border-[#cce7d5] bg-[#f2fbf5] px-4 py-3 text-sm font-medium text-[#4d8b63]">
                Password updated.
              </div>
            ) : null}
            <form action={changePassword} className="grid gap-3">
              <PasswordInput name="currentPassword" label="Current password" autoComplete="current-password" placeholder="Required if set" required={false} />
              <PasswordInput name="password" label="New password" autoComplete="new-password" placeholder="10+ characters" />
              <PasswordInput name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat password" />
              <Button type="submit" className="w-full sm:w-auto">
                <KeyRound size={17} aria-hidden />
                Update password
              </Button>
            </form>
            <div className="grid gap-2 pt-2 text-sm text-slate-500">
              <p>Google account status: {profile.user?.email ? "Available when connected" : "Not connected"}</p>
              <p>Session/device management: placeholder</p>
              <p>Two-factor authentication: placeholder</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Notification Preferences" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Medication reminders", "Bloodwork reminders", "Case updates", "Document uploads", "Organization messages", "Weekly summaries"].map((item) => (
            <label key={item} className="flex min-h-11 items-center gap-3 rounded-2xl bg-[#f8fafc] px-3 py-2 text-sm font-medium text-slate-600">
              <input type="checkbox" defaultChecked className="size-4 accent-harbor" />
              {item}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Family Management" />
        <div className="grid gap-3 lg:grid-cols-3">
          <ManagementTile icon={UsersRound} title="Family Members" description="Invite adults, caregivers, and support people. Update relationship and permissions." />
          <ManagementTile icon={UserRound} title="Child Management" description="Manage child profiles, medical notes, emergency contacts, organizations, and cases." />
          <ManagementTile icon={ShieldCheck} title="Child Permissions" description="Control who can view, upload, log, export, and invite for each child." />
        </div>
        <div className="mt-4 rounded-2xl border border-slate-100 p-3">
          <p className="font-semibold">Pending Invitations</p>
          <p className="mt-1 text-sm text-slate-500">
            {profile.invitations.length ? `${profile.invitations.length} invitations found. Resend, revoke, approve, and deny actions will be enabled as invitation workflows mature.` : "No pending invitations right now."}
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Privacy & Sharing" />
        <div className="grid gap-3 md:grid-cols-3">
          <SettingRow icon={ShieldCheck} label="Who has access" value={`${profile.familyMemberships.length + profile.caseParticipants.length + profile.organizationMemberships.length} active relationships`} />
          <SettingRow icon={FileIcon} label="Consent history" value="Placeholder" />
          <SettingRow icon={UsersRound} label="Data-sharing controls" value="Permission-aware sharing roadmap" />
        </div>
      </Card>

      <Card className="border-[#f3d4d4] bg-[#fffafa]">
        <SectionHeader title="Danger Zone" />
        <div className="grid gap-3 sm:grid-cols-3">
          <DangerAction icon={Download} label="Export my data" />
          <DangerAction icon={Trash2} label="Deactivate account" />
          <DangerAction icon={Trash2} label="Request data removal" />
        </div>
      </Card>
    </div>
  );
}

function PasswordInput({ name, label, autoComplete, placeholder, required = true }: { name: string; label: string; autoComplete: string; placeholder: string; required?: boolean }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        type="password"
        autoComplete={autoComplete}
        required={required}
        minLength={required ? 10 : undefined}
        className="min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10"
        placeholder={placeholder}
      />
    </label>
  );
}

function SettingRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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

function ManagementTile({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <Icon className="mb-3 text-harbor" size={22} aria-hidden />
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function DangerAction({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button type="button" className="touch-target flex items-center justify-center gap-2 rounded-2xl border border-[#f1cdcd] bg-white px-3 py-2 text-sm font-semibold text-error-muted transition hover:bg-[#fff5f5]">
      <Icon size={17} aria-hidden />
      {label}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">{children}</span>;
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

const FileIcon = ShieldCheck;
