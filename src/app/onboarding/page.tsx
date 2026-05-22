import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { AddressAutocompleteInput } from "@/components/ui/address-autocomplete-input";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, onboardingCompleted: true }
  });
  if (user?.onboardingCompleted) redirect("/");

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-slate-deep">
      <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-white bg-white p-5 calm-shadow">
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-harbor text-xl font-bold text-white">H</div>
          <p className="text-sm font-medium text-teal-soft">Welcome to HarborSync</p>
          <h1 className="mt-2 text-3xl font-semibold">Complete your profile</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            This helps family members and approved professionals understand how to contact you and coordinate safely.
          </p>
        </div>

        <form action={completeOnboarding} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full name" defaultValue={user?.name ?? ""} required />
            <Field name="preferredName" label="Preferred name" />
            <Field name="phone" label="Phone number" />
            <Field name="relationshipToChild" label="Relationship to children" placeholder="Parent, guardian, caregiver..." />
          </div>

          <AddressAutocompleteInput />

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Preferred contact method</span>
            <select name="preferredContact" className={fieldClass} defaultValue="Email">
              <option>Email</option>
              <option>Phone</option>
              <option>App notification</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="adultMedications" label="Active medications (optional)" />
            <Field name="adultConditions" label="Illnesses/conditions (optional)" />
            <Field name="emergencyContactName" label="Emergency contact name" />
            <Field name="emergencyContactPhone" label="Emergency contact phone" />
          </div>

          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="font-semibold">Family setup</p>
            <p className="mt-1 text-sm text-slate-500">You can create child profiles now or request access from Settings after onboarding.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field name="familyGroupName" label="Family group name" placeholder="The Parker Family" />
              <Field name="firstChildName" label="First child profile (optional)" />
              <Field name="firstChildDob" label="Child date of birth" type="date" />
              <Field name="knownGuardianEmail" label="Known guardian email" type="email" />
            </div>
          </div>

          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input name="hasActiveCase" type="checkbox" className="size-4 accent-harbor" />
              I have an active case or assigned support professional
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field name="caseworkerName" label="Caseworker/advocate name" />
              <Field name="caseworkerEmail" label="Caseworker/advocate email" type="email" />
              <Field name="caseworkerPhone" label="Caseworker/advocate phone" />
              <label className="space-y-1.5">
                <span className="text-sm font-semibold text-slate-700">Invite role</span>
                <select name="caseworkerRole" className={fieldClass} defaultValue="CPS_CASEWORKER">
                  <option value="CPS_CASEWORKER">CPS Caseworker</option>
                  <option value="ADVOCATE">Advocate</option>
                </select>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto">Finish onboarding</Button>
        </form>
      </section>
    </main>
  );
}

function Field({ name, label, type = "text", defaultValue, placeholder, required }: { name: string; label: string; type?: string; defaultValue?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} className={fieldClass} />
    </label>
  );
}

const fieldClass =
  "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
