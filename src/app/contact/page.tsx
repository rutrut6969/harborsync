import { submitContactInquiry } from "@/app/actions/contact";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { publicMetadata } from "@/components/marketing/seo";

export const metadata = publicMetadata(
  "Contact HarborSync | Beta Support and Partnerships",
  "Contact HarborSync for beta support, organization onboarding, partnership questions, donations, and family coordination inquiries.",
  "/contact"
);

export default async function ContactPage({ searchParams }: { searchParams?: Promise<{ submitted?: string; error?: string }> }) {
  const params = await searchParams;
  return (
    <MarketingShell>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_0.8fr]">
        <section>
          <p className="text-sm font-semibold text-teal-soft">Contact</p>
          <h1 className="mt-2 text-4xl font-semibold">Talk with HarborSync</h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">Questions about beta access, partnerships, organization onboarding, donations, or family support workflows are welcome.</p>
          {params?.submitted ? <div className="mt-5 rounded-2xl border border-[#cce7d5] bg-[#f2fbf5] px-4 py-3 text-sm font-medium text-[#4d8b63]">Message sent. Thank you for reaching out.</div> : null}
          {params?.error ? <div className="mt-5 rounded-2xl border border-[#f1cdcd] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-error-muted">{params.error}</div> : null}
          <form action={submitContactInquiry} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-5 calm-shadow">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="name" label="Name" />
              <Input name="email" label="Email" type="email" required />
            </div>
            <Input name="organization" label="Organization optional" />
            <Input name="subject" label="Subject" required />
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">Topic</span>
              <select name="topic" className={fieldClass}>
                <option>General question</option>
                <option>Partnership inquiry</option>
                <option>Organization onboarding</option>
                <option>Beta support</option>
                <option>Donation question</option>
                <option>Press / media</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">Message</span>
              <textarea name="message" required rows={5} className={textareaClass} />
            </label>
            <button className="touch-target rounded-2xl bg-harbor px-5 text-sm font-semibold text-white">Send message</button>
          </form>
        </section>
        <aside className="space-y-4">
          {["Beta access is reviewed manually.", "Organizations can apply now.", "HarborSync does not replace official medical, government, or legal systems.", "Donation and sponsorship systems are being prepared."].map((item) => (
            <div key={item} className="rounded-3xl bg-white p-5 text-sm leading-6 text-slate-600 calm-shadow">{item}</div>
          ))}
        </aside>
      </main>
    </MarketingShell>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">{label}</span><input className={fieldClass} {...props} /></label>;
}

const fieldClass = "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
const textareaClass = "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
