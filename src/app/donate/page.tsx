import { HeartHandshake } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { publicMetadata } from "@/components/marketing/seo";

export const metadata = publicMetadata(
  "Support HarborSync | Donations for Family Coordination Tools",
  "Support HarborSync development, accessibility improvements, infrastructure, and family support tools through donation-ready sponsorship tiers.",
  "/donate"
);

export default function DonatePage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm font-semibold text-teal-soft">Support the mission</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold">Help accelerate tools for families in stressful moments.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">Donations help support server costs, infrastructure, development, accessibility improvements, document workflows, and family support features. Stripe checkout is planned; these buttons are donation-ready placeholders for now.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {tiers.map((tier) => (
            <div key={tier.title} className="rounded-[2rem] bg-white p-5 calm-shadow">
              <HeartHandshake className="mb-4 text-harbor" size={24} aria-hidden />
              <h2 className="font-semibold">{tier.title}</h2>
              <p className="mt-2 text-2xl font-semibold text-harbor">{tier.amount}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">{tier.text}</p>
              <button type="button" className="mt-5 touch-target w-full rounded-2xl bg-[#e8f1f8] px-4 text-sm font-semibold text-harbor">Donation checkout coming soon</button>
            </div>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}

const tiers = [
  { title: "Individual Supporter", amount: "$10+", text: "Helps cover infrastructure and testing costs." },
  { title: "Family Advocate", amount: "$25+", text: "Supports accessibility improvements and family-centered workflows." },
  { title: "Organization Sponsor", amount: "$100+", text: "Helps accelerate organization and caseworker tools." },
  { title: "Community Partner", amount: "Custom", text: "Supports broader development for families and support organizations." }
];
