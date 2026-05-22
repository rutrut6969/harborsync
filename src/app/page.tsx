import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Building2, ClipboardCheck, FileHeart, FileText, HeartHandshake, LockKeyhole, Pill, ShieldCheck, Smartphone, UsersRound } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { organizationJsonLd, publicMetadata } from "@/components/marketing/seo";

export const metadata = publicMetadata(
  "HarborSync | Family Health Management and Caregiver Coordination",
  "HarborSync helps families, caregivers, caseworkers, and support organizations coordinate child profiles, medical logs, documents, follow-ups, and permission-based family access.",
  "/"
);

export default async function LandingPage() {
  const session = await auth();
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { platformRole: true } });
    if (user?.platformRole === "SUPER_ADMIN" || user?.platformRole === "PLATFORM_ADMIN") redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <MarketingShell>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#F5F7FA_0%,#e8f1f8_55%,#eef8f6_100%)]" />
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold text-teal-soft">Private Beta Development</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-deep md:text-6xl">
                Calm coordination for families, caregivers, and support teams.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                HarborSync brings child profiles, medication logs, doctor visits, bloodwork, follow-ups, documents, and permission-based family access into one secure, mobile-first workspace.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Family management beta is releasing soon. Organizations can apply now. All beta features are free during testing, and early testers may receive future account rewards or perks.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/apply" className="touch-target rounded-2xl bg-harbor px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#315f91]">Apply for Beta Access</Link>
                <Link href="#features" className="touch-target rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-harbor calm-shadow">Learn More</Link>
                <Link href="/donate" className="touch-target rounded-2xl border border-[#c8d8e8] px-5 py-3 text-center text-sm font-semibold text-slate-600">Support the Mission</Link>
              </div>
            </div>
            <div
              className="relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-white bg-cover bg-center calm-shadow"
              role="img"
              aria-label="A parent and child reviewing care notes together in a calm home setting"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1576765607924-2f7b8410a787?auto=format&fit=crop&w=1200&q=80)" }}
            >
              <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-white/92 p-4 backdrop-blur">
                <p className="font-semibold">One place for the daily details</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-2xl bg-[#e8f1f8] px-3 py-2 text-center">Logs</span>
                  <span className="rounded-2xl bg-[#eef8f6] px-3 py-2 text-center">Documents</span>
                  <span className="rounded-2xl bg-[#fff7e8] px-3 py-2 text-center">Follow-ups</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-14">
          <SectionIntro eyebrow="Features" title="Built for the real work of family coordination" text="HarborSync is designed for fast, low-stress daily use while preserving clear permissions and separate family contexts." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <details key={feature.title} className="group rounded-3xl border border-white bg-white p-5 calm-shadow">
                <summary className="cursor-pointer list-none">
                  <feature.icon className="mb-4 text-harbor" size={24} aria-hidden />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p>
                </summary>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-500">{feature.detail}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-white/65 py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionIntro eyebrow="Mission" title="Less fragmentation. More clarity when families need it most." text="Care details often live across texts, PDFs, portals, notebooks, and memory. HarborSync helps families build a calmer record of what happened, what is due next, and who is allowed to help." />
              <Link href="/apply" className="mt-6 inline-flex touch-target items-center rounded-2xl bg-harbor px-5 text-sm font-semibold text-white">Join the beta list</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mission.map((item) => <InfoCard key={item.title} {...item} />)}
            </div>
          </div>
        </section>

        <section id="organizations" className="mx-auto max-w-7xl px-4 py-14">
          <SectionIntro eyebrow="Organizations" title="A safer way for support teams to coordinate with families" text="HarborSync is preparing workflows for nonprofits, advocacy groups, CPS-style agencies, foster support, food pantries, housing support, and medical-family assistance teams." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {orgCards.map((item) => <InfoCard key={item.title} {...item} />)}
          </div>
        </section>

        <section className="bg-slate-deep py-14 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <SectionIntro eyebrow="Roadmap" title="Private beta development is underway" text="Family beta access is opening soon, organizations can apply now, and features are expanding rapidly during beta." dark />
            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {roadmap.map((item, index) => (
                <div key={item} className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs font-semibold text-white/55">Phase {index + 1}</p>
                  <p className="mt-2 font-semibold">{item}</p>
                  {index === 0 ? <p className="mt-2 text-xs font-semibold text-[#9ed7d1]">Current stage</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="rounded-[2rem] bg-white p-6 calm-shadow md:p-10">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold text-teal-soft">Beta Access</p>
                <h2 className="mt-2 text-3xl font-semibold">Families and organizations can apply now.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">HarborSync is invite/application-based during beta so access stays intentional, safe, and useful for real testing.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/apply" className="touch-target rounded-2xl bg-harbor px-5 py-3 text-center text-sm font-semibold text-white">Apply Now</Link>
                <Link href="/contact" className="touch-target rounded-2xl bg-[#e8f1f8] px-5 py-3 text-center text-sm font-semibold text-harbor">Contact Us</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

function SectionIntro({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text: string; dark?: boolean }) {
  return (
    <div>
      <p className="text-sm font-semibold text-teal-soft">{eyebrow}</p>
      <h2 className={`mt-2 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl ${dark ? "text-white" : "text-slate-deep"}`}>{title}</h2>
      <p className={`mt-3 max-w-3xl text-sm leading-6 ${dark ? "text-white/70" : "text-slate-500"}`}>{text}</p>
    </div>
  );
}

function InfoCard({ title, text, icon: Icon }: { title: string; text: string; icon: typeof HeartHandshake }) {
  return (
    <div className="rounded-3xl border border-white bg-white p-5 calm-shadow">
      <Icon className="mb-4 text-harbor" size={24} aria-hidden />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

const features = [
  { title: "Family Management", text: "Separate family groups with shared child access.", detail: "Useful for separated parents, blended families, guardians, foster placements, and caregiver support.", icon: UsersRound },
  { title: "Child Profiles", text: "Profiles for allergies, conditions, medications, doctors, and emergency contacts.", detail: "Children are managed profiles, not default login accounts.", icon: FileHeart },
  { title: "Medical Logs", text: "Medication, bulk medication, doctor visit, and bloodwork logs.", detail: "Designed for fast one-handed entry from a phone.", icon: Pill },
  { title: "Document Storage", text: "Upload PDFs, lab results, images, and doctor paperwork.", detail: "Documents can attach to children, cases, and log entries.", icon: FileText },
  { title: "Caseworker Coordination", text: "Assigned professionals see only assigned child and case data.", detail: "Built for permission-aware caseworker, advocate, and organization workflows.", icon: ClipboardCheck },
  { title: "Invite-Based Security", text: "Accounts are approved or invited before activation.", detail: "Google sign-in and email access are both authorization-gated.", icon: LockKeyhole },
  { title: "Notifications", text: "Prepared for reminders, uploads, case updates, and follow-ups.", detail: "Demo notifications already show the intended workflow style.", icon: Bell },
  { title: "PDF Exporting", text: "Export visible records for review or sharing.", detail: "Exports are designed to respect permissions and active filters.", icon: ShieldCheck },
  { title: "Mobile-First Design", text: "Built around touch targets, calm spacing, and quick scanning.", detail: "The guiding question: can a stressed parent use this quickly with one hand?", icon: Smartphone },
  { title: "Organization Sponsorships", text: "Prepared for sponsored family access and organization seats.", detail: "Future organization tools will support nonprofits, advocates, and family assistance groups.", icon: Building2 },
  { title: "Audit Logging", text: "Track access changes, invites, uploads, and record activity.", detail: "HarborSync is designed to make accountability visible without clutter.", icon: ClipboardCheck },
  { title: "Assistance Workflows", text: "Future support for government and nonprofit application coordination.", detail: "HarborSync will not approve applications; it will help families organize requirements and documents.", icon: HeartHandshake }
];

const mission = [
  { title: "For overwhelmed families", text: "A calmer place to keep daily care information, records, and follow-ups organized.", icon: HeartHandshake },
  { title: "For caregivers", text: "Approved access to the details they need without exposing unrelated household information.", icon: UsersRound },
  { title: "For caseworkers", text: "Assigned child and case context without unrelated family visibility.", icon: ClipboardCheck },
  { title: "For special-needs and medical families", text: "Medication, bloodwork, documents, and visit history in one permission-aware workspace.", icon: FileHeart }
];

const orgCards = [
  { title: "Family support nonprofits", text: "Prepare for sponsored family slots, document coordination, and consent-based collaboration.", icon: Building2 },
  { title: "Advocacy and case teams", text: "Coordinate with guardians, caregivers, and professionals around assigned children and cases.", icon: ShieldCheck },
  { title: "Assistance programs", text: "Future workflows can help families gather proof documents and track application requirements.", icon: FileText }
];

const roadmap = ["MVP Family Beta", "Caseworker Beta", "Organization Access", "Notifications", "Mobile Apps", "Government Assistance Integrations", "Healthcare Integrations", "Advanced Automation"];
