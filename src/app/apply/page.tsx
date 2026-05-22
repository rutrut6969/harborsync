import { submitApplication } from "@/app/actions/applications";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { publicMetadata } from "@/components/marketing/seo";

export const metadata = publicMetadata(
  "Apply for HarborSync Beta Access",
  "Apply for HarborSync beta access as a family, caseworker, advocate, caregiver, or organization supporting families.",
  "/apply"
);

export default async function ApplyPage({ searchParams }: { searchParams?: Promise<{ submitted?: string; error?: string }> }) {
  const params = await searchParams;
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold text-teal-soft">Beta Access</p>
        <h1 className="mt-2 text-4xl font-semibold">Apply to use HarborSync</h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">HarborSync is currently invite/application-based during beta so family, caseworker, and organization workflows can be tested safely.</p>
        {params?.submitted ? <Notice tone="success">Application submitted. We’ll review it and follow up as beta access expands.</Notice> : null}
        {params?.error ? <Notice tone="error">{params.error}</Notice> : null}
        <form action={submitApplication} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-5 calm-shadow">
          <input type="hidden" name="returnPath" value="/apply" />
          <Label title="Application type">
            <select name="type" className={fieldClass} defaultValue="FAMILY">
              <option value="FAMILY">Family</option>
              <option value="CASEWORKER">Caseworker</option>
              <option value="ORGANIZATION">Organization</option>
              <option value="ADVOCATE">Advocate / Caregiver</option>
            </select>
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label title="Name"><input name="name" required className={fieldClass} /></Label>
            <Label title="Email"><input name="email" required type="email" className={fieldClass} /></Label>
          </div>
          <Label title="Organization optional"><input name="organizationName" className={fieldClass} /></Label>
          <Label title="Intended use"><textarea name="intendedUse" rows={3} className={textareaClass} /></Label>
          <Label title="Number of family members / caseworkers"><input name="teamSize" className={fieldClass} /></Label>
          <Label title="Goals or interests"><textarea name="goals" rows={3} className={textareaClass} /></Label>
          <Label title="Optional notes"><textarea name="notes" rows={3} className={textareaClass} /></Label>
          <button type="submit" className="touch-target rounded-2xl bg-harbor px-5 text-sm font-semibold text-white">Submit application</button>
        </form>
      </main>
    </MarketingShell>
  );
}

function Label({ title, children }: { title: string; children: React.ReactNode }) {
  return <label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">{title}</span>{children}</label>;
}

function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${tone === "success" ? "border border-[#cce7d5] bg-[#f2fbf5] text-[#4d8b63]" : "border border-[#f1cdcd] bg-[#fff5f5] text-error-muted"}`}>{children}</div>;
}

const fieldClass = "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
const textareaClass = "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
