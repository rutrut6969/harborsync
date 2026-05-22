import { MarketingShell } from "@/components/marketing/marketing-shell";
import { publicMetadata } from "@/components/marketing/seo";

export const metadata = publicMetadata(
  "HarborSync FAQ | Beta, Security, Permissions, and Family Coordination",
  "Answers about HarborSync beta access, caregiver coordination, separated parents, organization applications, permissions, sensitive data, and future mobile apps.",
  "/faq"
);

export default function FAQPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-sm font-semibold text-teal-soft">FAQ</p>
        <h1 className="mt-2 text-4xl font-semibold">Questions families and organizations ask</h1>
        <div className="mt-8 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-3xl bg-white p-5 calm-shadow">
              <summary className="cursor-pointer list-none font-semibold">{item.q}</summary>
              <p className="mt-3 text-sm leading-6 text-slate-500">{item.a}</p>
            </details>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}

const faqs = [
  { q: "What is HarborSync?", a: "HarborSync is a mobile-first family health management and caregiver coordination platform for child profiles, logs, documents, follow-ups, case activity, and permission-based sharing." },
  { q: "Who is HarborSync for?", a: "It is designed for parents, guardians, caregivers, caseworkers, advocates, nonprofits, and family support organizations." },
  { q: "Is HarborSync public yet?", a: "Not fully. HarborSync is in private beta development and uses invite/application-based access." },
  { q: "Is HarborSync HIPAA compliant?", a: "HarborSync is being designed with security and privacy in mind, but formal compliance certifications are not being claimed during this beta stage." },
  { q: "How does beta access work?", a: "Families and organizations apply or receive an invite. Approved emails can activate accounts and test beta features." },
  { q: "Can organizations apply?", a: "Yes. Nonprofits, advocacy groups, caseworker teams, and support organizations can apply for beta access." },
  { q: "Will mobile apps exist?", a: "Native iOS and Android apps are planned for the future. The current product is mobile-first on the web." },
  { q: "How are permissions handled?", a: "Access is relationship-based. Adults are not globally tied together just because they share access to a child profile." },
  { q: "Can separated parents use HarborSync?", a: "Yes. A child can belong to multiple separate family groups, allowing parents to share child records without merging households." },
  { q: "How is sensitive data protected?", a: "Sensitive-data storage is being prepared with server-side encryption and strict access boundaries. Full SSNs should not be exposed in normal app views, exports, notifications, or logs." }
];
