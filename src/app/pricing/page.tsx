import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { publicMetadata } from "@/components/marketing/seo";

export const metadata = publicMetadata(
  "HarborSync Pricing | Family and Organization Beta Plans",
  "Review HarborSync beta pricing for families, caregivers, caseworkers, nonprofits, and support organizations. All beta features are free during testing.",
  "/pricing"
);

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm font-semibold text-teal-soft">Pricing</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold">Simple beta access now. Thoughtful plans later.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">During beta testing, all premium family features are currently included free. HarborSync is application-based while workflows are refined with real families and organizations.</p>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Family Plans</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <PriceCard title="Free Beta" price="$0 during beta" cta="Apply for Access" items={["Family records", "Child profiles", "Medication and visit logs", "Document management", "Shared access", "PDF exports"]} />
            <PriceCard title="Future Premium" price="Planned pricing" cta="Join Beta List" items={["Premium features included free during beta", "Expanded records and storage", "Advanced reminders", "More family collaboration controls", "Future mobile app features"]} />
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Organization Plans</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <PriceCard title="Small Organization" price="Planned" cta="Apply for Access" items={["Limited caseworkers", "Limited sponsored families", "Basic case coordination", "Invite-based access"]} />
            <PriceCard title="Growth Organization" price="Planned" cta="Apply for Access" items={["Expanded access", "Organization dashboard", "Case coordination", "Family sponsorship controls"]} />
            <PriceCard title="Enterprise / Government" price="Custom" cta="Contact HarborSync" items={["Custom onboarding", "Large-scale support", "Advanced permissions", "Future integration planning"]} />
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

function PriceCard({ title, price, items, cta }: { title: string; price: string; items: string[]; cta: string }) {
  return (
    <div className="rounded-[2rem] border border-white bg-white p-6 calm-shadow">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-harbor">{price}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm text-slate-600">
            <CheckCircle2 className="mt-0.5 shrink-0 text-teal-soft" size={18} aria-hidden />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <Link href="/apply" className="mt-6 inline-flex touch-target w-full items-center justify-center rounded-2xl bg-harbor px-4 text-sm font-semibold text-white">{cta}</Link>
    </div>
  );
}
