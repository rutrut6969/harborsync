import Link from "next/link";
import { submitApplication } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";

export default async function ApplicationsPage({
  searchParams
}: {
  searchParams?: Promise<{ submitted?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-slate-deep">
      <section className="w-full max-w-lg rounded-[1.75rem] border border-white bg-white p-6 calm-shadow">
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-harbor text-xl font-bold text-white">H</div>
          <p className="text-sm font-medium text-teal-soft">Access application</p>
          <h1 className="mt-2 text-3xl font-semibold">Request HarborSync access</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            HarborSync is approval-based. Submit this request and a platform admin can approve or waitlist access.
          </p>
        </div>
        {params?.submitted ? <p className="mb-4 rounded-2xl bg-[#effaf3] p-3 text-sm font-medium text-[#417a54]">Application submitted.</p> : null}
        {params?.error ? <p className="mb-4 rounded-2xl bg-[#fff7f7] p-3 text-sm font-medium text-error-muted">{params.error}</p> : null}
        <form action={submitApplication} className="grid gap-3">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Application type</span>
            <select name="type" className={fieldClass}>
              <option value="FAMILY">Family account</option>
              <option value="CASEWORKER">Caseworker</option>
              <option value="ADVOCATE">Advocate</option>
              <option value="ORGANIZATION">Organization</option>
            </select>
          </label>
          <Field name="name" label="Name" />
          <Field name="email" label="Email" type="email" required />
          <Field name="organizationName" label="Organization, if applicable" />
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Notes</span>
            <textarea name="notes" rows={4} className={fieldClass} />
          </label>
          <Button type="submit" className="w-full">Submit application</Button>
        </form>
        <Link href="/sign-in" className="mt-4 block text-center text-sm font-semibold text-harbor">Back to sign in</Link>
      </section>
    </main>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input name={name} type={type} required={required} className={fieldClass} />
    </label>
  );
}

const fieldClass = "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
