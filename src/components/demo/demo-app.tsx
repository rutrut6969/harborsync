"use client";

import {
  Activity,
  AlertCircle,
  BellRing,
  Building2,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  FolderOpen,
  HeartPulse,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Pill,
  PlusCircle,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  demoActivity,
  demoCases,
  demoChildren,
  demoDocuments,
  demoFamilyMembers,
  demoFollowUps,
  demoNotifications,
  demoOrganizations,
  demoRecords,
  demoSettings
} from "@/lib/demo-environment-data";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type DemoTab = "home" | "records" | "add" | "documents" | "access" | "profile" | "settings";
type DemoRecord = (typeof demoRecords)[number];

export function DemoApp() {
  const [tab, setTab] = useState<DemoTab>("home");
  const [records, setRecords] = useState<DemoRecord[]>(demoRecords);
  const [notice, setNotice] = useState("");

  function addSandboxMedication() {
    const record = {
      id: `sandbox-${Date.now()}`,
      category: "Medication",
      patient: "Avery Parker",
      title: "Sandbox medication entry",
      date: "2026-05-22",
      status: "Given",
      detail: "This entry exists only in your browser for the demo session."
    };
    setRecords((current) => [record, ...current]);
    setNotice("Sandbox medication log added locally. No production data was changed.");
    setTab("records");
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-28 text-slate-deep md:pb-0">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="hidden items-center gap-3 md:flex">
            <div className="grid size-10 place-items-center rounded-2xl bg-harbor text-lg font-bold text-white shadow-sm">
              H
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">HarborSync Demo</p>
              <p className="text-xs text-slate-500">Safe sandbox environment</p>
            </div>
          </div>
          <DemoMobileAccountMenu
            onNavigate={(nextTab) => {
              setTab(nextTab);
              setNotice("");
            }}
            onLogout={() => {
              setTab("home");
              setNotice("Demo logout simulated. You are still viewing the safe public sandbox.");
            }}
          />
          <div className="flex items-center gap-2">
            <DemoNotificationsPopover />
            <span className="hidden rounded-full bg-[#eef8f6] px-3 py-1.5 text-xs font-semibold text-teal-soft sm:inline-flex">
              Demo Mode - sample data only
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 md:grid-cols-[13rem_minmax(0,1fr)] md:py-8">
        <aside className="hidden md:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-white bg-white/80 p-2 calm-shadow">
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={cn(
                  "touch-target flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
                  tab === item.value ? "bg-[#e8f1f8] text-harbor" : "text-slate-600 hover:bg-[#eef4fa] hover:text-harbor"
                )}
              >
                <item.icon size={18} aria-hidden />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Card className="mb-5 border-[#d8e8f6] bg-[#f8fbfd]">
            <div className="flex gap-3 text-sm leading-6 text-slate-600">
              <LockKeyhole className="mt-0.5 shrink-0 text-harbor" size={18} aria-hidden />
              <p>
                This is a public demo sandbox with fake records. It does not send email, create uploads, or access
                production family data.
              </p>
            </div>
          </Card>

          {notice ? (
            <div className="mb-5 rounded-2xl border border-[#cde7d6] bg-[#effaf3] p-3 text-sm font-medium text-[#417a54]">
              {notice}
            </div>
          ) : null}

          {tab === "home" ? (
            <DemoHome records={records} />
          ) : tab === "records" ? (
            <DemoRecords records={records} />
          ) : tab === "add" ? (
            <DemoAddLog onAdd={addSandboxMedication} />
          ) : tab === "documents" ? (
            <DemoDocuments />
          ) : tab === "profile" ? (
            <DemoProfile />
          ) : tab === "settings" ? (
            <DemoSettings
              onSimulate={(message) => {
                setNotice(message);
                setTab("settings");
              }}
            />
          ) : (
            <DemoAccess />
          )}
        </main>
      </div>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-10px_30px_rgba(43,49,56,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {demoMobileTabs.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={cn(
                "touch-target flex flex-col items-center justify-center gap-1 rounded-2xl text-[0.68rem] font-medium text-slate-500 transition",
                tab === item.value && "bg-[#e8f1f8] text-harbor"
              )}
            >
              <item.icon size={20} aria-hidden />
              <span>{item.mobileLabel ?? item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function DemoMobileAccountMenu({ onNavigate, onLogout }: { onNavigate: (tab: DemoTab) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative min-w-0 md:hidden">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex min-w-0 items-center gap-3 rounded-2xl py-1.5 pr-2 text-left transition focus:outline-none focus:ring-4 focus:ring-[#dfeaf5]"
      >
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e8f1f8] text-sm font-bold text-harbor shadow-sm">
          JP
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">Jordan Parker</p>
          <p className="truncate text-xs text-slate-500">Family Admin - Demo</p>
        </div>
        <ChevronDown className={cn("shrink-0 text-slate-400 transition", open && "rotate-180")} size={15} aria-hidden />
      </button>

      <div
        role="menu"
        className={cn(
          "fixed left-3 right-3 top-[4.25rem] z-50 origin-top rounded-2xl border border-white bg-white p-2 safe-top calm-shadow transition",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="border-b border-slate-100 px-3 py-3">
          <p className="font-semibold">Jordan Parker</p>
          <p className="truncate text-sm text-slate-500">demo.family@harborsync.test</p>
        </div>
        <DemoMenuButton icon={Settings} label="Account Settings" onClick={() => { onNavigate("settings"); setOpen(false); }} />
        <DemoMenuButton icon={BellRing} label="Notification Preferences" onClick={() => { onNavigate("settings"); setOpen(false); }} />
        <DemoMenuButton icon={Building2} label="Organization Access" onClick={() => { onNavigate("access"); setOpen(false); }} />
        <DemoMenuButton icon={UsersRound} label="Family Management" onClick={() => { onNavigate("settings"); setOpen(false); }} />
        <div className="mt-1 border-t border-slate-100 pt-1">
          <DemoMenuButton icon={LogOut} label="Log Out" danger onClick={() => { onLogout(); setOpen(false); }} />
        </div>
      </div>
    </div>
  );
}

function DemoNotificationsPopover() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadCount = demoNotifications.filter((item) => item.status === "Unread").length;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="touch-target relative grid size-11 place-items-center rounded-full border border-white bg-white text-slate-500 shadow-sm transition hover:text-harbor focus:outline-none focus:ring-4 focus:ring-[#dfeaf5]"
      >
        <BellRing size={19} aria-hidden />
        <span className="sr-only">Demo notifications</span>
        <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-harbor text-[0.65rem] font-bold text-white">
          {unreadCount}
        </span>
      </button>
      <div
        className={cn(
          "fixed left-3 right-3 top-[4.25rem] z-50 origin-top rounded-2xl border border-white bg-white p-3 calm-shadow transition sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-[23rem] sm:origin-top-right",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="font-semibold">Demo Notifications</p>
          <span className="rounded-full bg-[#e8f1f8] px-2 py-1 text-xs font-semibold text-harbor">{unreadCount} new</span>
        </div>
        <div className="max-h-[22rem] space-y-2 overflow-y-auto">
          {demoNotifications.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{item.description}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-1 text-xs font-semibold", item.status === "Unread" ? "bg-[#e8f1f8] text-harbor" : "bg-[#f4f8fb] text-slate-500")}>
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-teal-soft">{item.type} - {item.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoMenuButton({ icon: Icon, label, onClick, danger }: { icon: LucideIcon; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "touch-target flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
        danger ? "text-error-muted hover:bg-[#fff7f7]" : "text-slate-600 hover:bg-[#eef4fa] hover:text-harbor"
      )}
    >
      <Icon size={17} aria-hidden />
      {label}
    </button>
  );
}

function DemoHome({ records }: { records: DemoRecord[] }) {
  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] bg-slate-deep p-5 text-white calm-shadow">
        <p className="text-sm text-white/70">Investor and tester preview</p>
        <h1 className="mt-1 max-w-lg text-2xl font-semibold leading-tight">
          Calm family coordination with safe, realistic demo data.
        </h1>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Children" value="2" />
          <Stat label="Cases" value="2" />
          <Stat label="Records" value={String(records.length)} />
          <Stat label="Emails" value="0 sent" />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Card>
            <SectionHeader title="Upcoming Follow-Ups" />
            <div className="space-y-3">
              {demoFollowUps.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-[#f4f8fb] p-3">
                  <CalendarDays className="mt-1 shrink-0 text-harbor" size={20} aria-hidden />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-500">
                      {item.date} - {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Recent Logs" />
            <div className="space-y-3">
              {records.slice(0, 4).map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="Child Profiles" />
            <div className="space-y-3">
              {demoChildren.map((child) => (
                <div key={child.id} className="rounded-2xl border border-slate-100 p-3">
                  <p className="font-semibold">{child.fullName}</p>
                  <p className="text-sm text-slate-500">
                    Age {child.age} - {child.conditions}
                  </p>
                  <p className="mt-2 text-xs font-medium text-teal-soft">{child.primaryDoctor}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Activity Feed" />
            <div className="space-y-3">
              {demoActivity.map((item) => (
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

function DemoRecords({ records }: { records: DemoRecord[] }) {
  const [filter, setFilter] = useState("All");
  const filteredRecords = useMemo(() => {
    if (filter === "All") return records;
    return records.filter((record) => record.category === filter);
  }, [filter, records]);

  return (
    <div className="space-y-5">
      <PageTitle eyebrow="Sandbox records" title="Records Center" />
      <Card>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {["All", "Medication", "Doctor Visit", "Bloodwork", "Document"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "touch-target shrink-0 rounded-2xl px-4 text-sm font-semibold transition",
                filter === item ? "bg-harbor text-white" : "bg-[#f4f8fb] text-slate-600"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredRecords.length ? (
            filteredRecords.map((record) => <RecordCard key={record.id} record={record} expanded />)
          ) : (
            <EmptyState icon={FolderOpen} title="No records in this view" description="Try another record type." />
          )}
        </div>
      </Card>
    </div>
  );
}

function DemoAddLog({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="space-y-5">
      <PageTitle eyebrow="Sandbox interaction" title="Add Log" />
      <Card>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Medication", icon: Pill },
            { label: "Doctor Visit", icon: HeartPulse },
            { label: "Bloodwork", icon: Activity },
            { label: "Document", icon: FileText }
          ].map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "touch-target rounded-2xl border p-3 text-left text-sm font-semibold transition",
                index === 0 ? "border-[#c9ddec] bg-[#e8f1f8] text-harbor" : "border-slate-100 bg-[#f8fafc] text-slate-600"
              )}
            >
              <item.icon className="mb-2" size={19} aria-hidden />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <DemoField label="Patient" value="Avery Parker" />
            <DemoField label="Medication" value="Prednisone" />
            <DemoField label="Dose" value="5 mg" />
            <DemoField label="Status" value="Given" />
          </div>
          <Button type="button" className="w-full" onClick={onAdd}>
            <PlusCircle size={18} aria-hidden />
            Add sandbox medication log
          </Button>
        </div>
      </Card>
    </div>
  );
}

function DemoDocuments() {
  return (
    <div className="space-y-5">
      <PageTitle eyebrow="Safe document preview" title="Documents" />
      <Card>
        <EmptyState
          icon={FileText}
          title="Uploads are disabled in demo mode"
          description="This preview shows document workflows without sending files to production storage."
        />
      </Card>
      <Card>
        <SectionHeader title="Example Documents" />
        <div className="space-y-3">
          {demoDocuments.map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3">
              <div>
                <p className="font-semibold">{document.title}</p>
                <p className="text-sm text-slate-500">
                  {document.attachedTo} - {document.date}
                </p>
              </div>
              <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
                {document.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DemoProfile() {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-0">
        <div className="bg-[linear-gradient(135deg,#e8f1f8,#eef8f6)] p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-3xl bg-harbor text-xl font-bold text-white shadow-sm">
              JP
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-teal-soft">Demo Profile</p>
              <h1 className="truncate text-2xl font-semibold text-slate-deep">Jordan Parker</h1>
              <p className="truncate text-sm text-slate-600">{demoSettings.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <DemoPill>Family Admin</DemoPill>
                <DemoPill>Parker Family</DemoPill>
                <DemoPill>Demo active</DemoPill>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <Card>
            <SectionHeader title="Recent Updates" />
            <div className="space-y-3">
              {demoRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex gap-3 rounded-2xl border border-slate-100 p-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#eef8f6] text-teal-soft">
                    <Activity size={19} aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold">{record.title}</p>
                    <p className="text-sm text-slate-500">{record.detail}</p>
                    <p className="mt-2 text-xs font-semibold text-harbor">{record.patient} - {record.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Child Quick Access" />
            <div className="grid gap-3 md:grid-cols-2">
              {demoChildren.map((child) => (
                <div key={child.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{child.fullName}</p>
                      <p className="text-sm text-slate-500">DOB {child.dob} - Age {child.age}</p>
                    </div>
                    <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-bold text-harbor">+2 new</span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <DemoInfo label="Allergies" value={child.allergies} />
                    <DemoInfo label="Conditions" value={child.conditions} />
                    <DemoInfo label="Medications" value={child.medications} />
                    <DemoInfo label="Doctor" value={child.primaryDoctor} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="Family Relationships" />
            <div className="space-y-3">
              {demoFamilyMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-[#e8f1f8] text-sm font-bold text-harbor">{initials(member.name)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.relationship} - {member.role}</p>
                  </div>
                  {member.newCount ? <span className="rounded-full bg-[#e8f1f8] px-2 py-1 text-xs font-bold text-harbor">+{member.newCount}</span> : null}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Important Information" />
            <div className="space-y-3">
              <DemoImportant icon={AlertCircle} label="Emergency contacts" value="2 child profiles have contacts listed" />
              <DemoImportant icon={ShieldCheck} label="Permissions summary" value="Family admin, advocate, caregiver access" />
              <DemoImportant icon={FileText} label="Documents needing review" value="1 lab result awaiting review" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DemoSettings({ onSimulate }: { onSimulate: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <PageTitle eyebrow="Demo settings" title="Account Settings" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Account Information" />
          <div className="space-y-3">
            <DemoImportant icon={UserRound} label="Name" value={demoSettings.name} />
            <DemoImportant icon={Mail} label="Email" value={demoSettings.email} />
            <DemoImportant icon={ShieldCheck} label="Account status" value={demoSettings.accountStatus} />
          </div>
        </Card>

        <Card>
          <SectionHeader title="Contact Information" />
          <div className="space-y-3">
            <DemoImportant icon={Mail} label="Alternate email" value={demoSettings.alternateEmail} />
            <DemoImportant icon={MapPin} label="Mailing address" value={demoSettings.mailingAddress} />
            <DemoImportant icon={BellRing} label="Preferred contact" value={demoSettings.contactMethod} />
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Security" />
        <div className="grid gap-3 sm:grid-cols-3">
          {["Change password", "Session management", "Two-factor auth"].map((item) => (
            <button key={item} type="button" onClick={() => onSimulate(`${item} is simulated in demo mode. No account data was changed.`)} className="touch-target rounded-2xl border border-slate-100 bg-[#f8fafc] px-3 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-[#eef4fa]">
              {item}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Notification Preferences" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demoSettings.notificationPreferences.map((item) => (
            <label key={item} className="flex min-h-11 items-center gap-3 rounded-2xl bg-[#f8fafc] px-3 py-2 text-sm font-medium text-slate-600">
              <input type="checkbox" defaultChecked className="size-4 accent-harbor" onChange={() => onSimulate("Notification preference toggled locally for this demo session only.")} />
              {item}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Family Management" />
        <div className="space-y-3">
          {demoFamilyMembers.map((member) => (
            <div key={member.id} className="rounded-2xl border border-slate-100 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.relationship} - {member.access}</p>
                </div>
                <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">{member.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Update permissions", "Resend invite", "Remove"].map((action) => (
                  <button key={action} type="button" onClick={() => onSimulate(`${action} is simulated. No invitation or access changes were sent.`)} className="touch-target rounded-2xl bg-[#f4f8fb] px-3 text-xs font-semibold text-slate-600">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-[#f3d4d4] bg-[#fffafa]">
        <SectionHeader title="Danger Zone" />
        <div className="grid gap-3 sm:grid-cols-3">
          <DemoDanger icon={Download} label="Export my data" onClick={() => onSimulate("Demo export simulated. No file was generated from production data.")} />
          <DemoDanger icon={Trash2} label="Deactivate account" onClick={() => onSimulate("Demo deactivation simulated. No account was changed.")} />
          <DemoDanger icon={Trash2} label="Request data removal" onClick={() => onSimulate("Demo removal request simulated. No email or workflow was sent.")} />
        </div>
      </Card>
    </div>
  );
}

function DemoAccess() {
  return (
    <div className="space-y-5">
      <PageTitle eyebrow="Organizations and cases" title="Access Model" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Organizations" />
          <div className="space-y-3">
            {demoOrganizations.map((organization) => (
              <div key={organization.name} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{organization.name}</p>
                  <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">
                    {organization.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{organization.type}</p>
                <p className="mt-2 text-xs font-medium text-harbor">{organization.role}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Cases" />
          <div className="space-y-3">
            {demoCases.map((careCase) => (
              <div key={careCase.id} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{careCase.title}</p>
                  <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
                    {careCase.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {careCase.child} - {careCase.organization}
                </p>
                <p className="mt-2 text-xs font-medium text-teal-soft">{careCase.participants}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function RecordCard({ record, expanded }: { record: DemoRecord; expanded?: boolean }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
            {record.category}
          </span>
          <h3 className="mt-2 text-base font-semibold leading-snug">{record.title}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">
          {record.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <DemoMini label="Patient" value={record.patient} />
        <DemoMini label="Date" value={record.date} />
      </div>
      {expanded ? <p className="mt-3 rounded-xl bg-[#f8fafc] p-3 text-sm leading-6 text-slate-600">{record.detail}</p> : null}
    </article>
  );
}

function DemoField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      <input
        readOnly
        value={value}
        className="touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base text-slate-600 outline-none"
      />
    </label>
  );
}

function DemoMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f8fafc] p-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-slate-700">{value}</p>
    </div>
  );
}

function DemoInfo({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-slate-deep">{label}:</span> {value}
    </p>
  );
}

function DemoImportant({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#f8fafc] p-3">
      <Icon className="shrink-0 text-harbor" size={19} aria-hidden />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function DemoDanger({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="touch-target flex items-center justify-center gap-2 rounded-2xl border border-[#f1cdcd] bg-white px-3 py-2 text-sm font-semibold text-error-muted transition hover:bg-[#fff5f5]">
      <Icon size={17} aria-hidden />
      {label}
    </button>
  );
}

function DemoPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">{children}</span>;
}

function initials(value: string) {
  return value
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}

function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-teal-soft">{eyebrow}</p>
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}

const tabs = [
  { value: "home" as const, label: "Home", icon: Home },
  { value: "records" as const, label: "Records", icon: FolderOpen },
  { value: "add" as const, label: "Add Log", mobileLabel: "Add", icon: PlusCircle },
  { value: "documents" as const, label: "Documents", mobileLabel: "Docs", icon: FileText },
  { value: "profile" as const, label: "Profile", icon: UserRound },
  { value: "access" as const, label: "Access", icon: Building2 },
  { value: "settings" as const, label: "Settings", icon: Settings }
];

const demoMobileTabs = tabs.filter((item) => ["home", "records", "add", "documents", "profile"].includes(item.value));
