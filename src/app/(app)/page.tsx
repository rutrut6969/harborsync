import Link from "next/link";
import { CalendarDays, ClipboardPlus, FileHeart, Pill, PlusCircle, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { ExpandableCard } from "@/components/ui/expandable-card";

export default async function HomePage() {
  const session = await auth();
  const { activity, children, recentLogs, upcoming } = await getDashboardData(session?.user?.id ?? "");

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] bg-slate-deep p-5 text-white calm-shadow">
        <p className="text-sm text-white/70">Today</p>
        <h1 className="mt-1 max-w-lg text-2xl font-semibold leading-tight">
          Everything important is in one calm place.
        </h1>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="touch-target rounded-2xl bg-white/10 p-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              <item.icon className="mb-2" size={20} aria-hidden />
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Card>
            <SectionHeader title="Upcoming Follow-Ups" />
            <div className="space-y-3">
              {upcoming.map((item) => (
                <ExpandableCard key={item.title} title={item.title} subtitle={`${item.date} - ${item.detail}`} badge="Follow-up">
                  <div className="flex gap-3">
                    <CalendarDays className="mt-1 shrink-0 text-harbor" size={20} aria-hidden />
                    <div>
                      <p><span className="font-semibold text-slate-deep">Due:</span> {item.date}</p>
                      <p><span className="font-semibold text-slate-deep">Details:</span> {item.detail}</p>
                      <p><span className="font-semibold text-slate-deep">Notes:</span> Related doctor, facility, and record notes appear here as they are logged.</p>
                    </div>
                  </div>
                </ExpandableCard>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Recent Logs" action={<Link href="/records" className="text-sm font-semibold text-harbor">View all</Link>} />
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <ExpandableCard key={`${log.type}-${log.title}`} title={log.title} subtitle={`${log.child} - ${log.meta}`} badge={log.type}>
                  <p><span className="font-semibold text-slate-deep">Patient:</span> {log.child}</p>
                  <p><span className="font-semibold text-slate-deep">Type:</span> {log.type}</p>
                  <p><span className="font-semibold text-slate-deep">Details:</span> {log.meta}</p>
                  <p><span className="font-semibold text-slate-deep">Documents:</span> Attached images and PDFs will appear here when uploaded.</p>
                </ExpandableCard>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="Children" />
            <div className="space-y-3">
              {children.map((child) => (
              <Link
                  key={child.id}
                  href={`/children/${child.id}?from=home`}
                  className="block rounded-2xl border border-slate-100 p-3 transition hover:border-[#c8d8e8] hover:bg-[#f7fafc]"
                >
                  <p className="font-semibold">{child.fullName}</p>
                  <p className="text-sm text-slate-500">{child.conditions}</p>
                  <p className="mt-2 text-xs font-medium text-teal-soft">{child.primaryDoctor}</p>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Medication Reminders" />
            <div className="rounded-2xl bg-[#f8f4ea] p-4">
              <div className="flex items-center gap-3">
                <Pill className="text-warning" size={22} aria-hidden />
                <p className="font-medium">Reminder scheduling placeholder</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                The V1 data model is ready for reminders; notification scheduling can be activated later.
              </p>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Activity Feed" />
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item} className="flex gap-3 text-sm">
                  <ShieldCheck className="mt-0.5 shrink-0 text-teal-soft" size={17} aria-hidden />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const quickActions = [
  { label: "Medication", href: "/add-log?type=medication", icon: Pill },
  { label: "Doctor Visit", href: "/add-log?type=doctor", icon: ClipboardPlus },
  { label: "Bloodwork", href: "/add-log?type=bloodwork", icon: FileHeart },
  { label: "Upload", href: "/documents", icon: PlusCircle }
];
