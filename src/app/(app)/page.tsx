import Link from "next/link";
import { CalendarDays, ClipboardPlus, FileHeart, Pill, PlusCircle, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";

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
                <div key={item.title} className="flex gap-3 rounded-2xl bg-[#f4f8fb] p-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e1eff6] text-harbor">
                    <CalendarDays size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-500">
                      {item.date} · {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Recent Logs" action={<Link href="/records" className="text-sm font-semibold text-harbor">View all</Link>} />
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={`${log.type}-${log.title}`} className="rounded-2xl border border-slate-100 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
                      {log.type}
                    </span>
                    <span className="text-xs text-slate-400">{log.child}</span>
                  </div>
                  <p className="font-medium">{log.title}</p>
                  <p className="text-sm text-slate-500">{log.meta}</p>
                </div>
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
                  href={`/children/${child.id}`}
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
