"use client";

import {
  Activity,
  Building2,
  CalendarDays,
  FileText,
  FolderOpen,
  HeartPulse,
  Home,
  LockKeyhole,
  Pill,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  demoActivity,
  demoCases,
  demoChildren,
  demoDocuments,
  demoFollowUps,
  demoOrganizations,
  demoRecords
} from "@/lib/demo-environment-data";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type DemoTab = "home" | "records" | "add" | "documents" | "access";
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
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-harbor text-lg font-bold text-white shadow-sm">
              H
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">HarborSync Demo</p>
              <p className="text-xs text-slate-500">Safe sandbox environment</p>
            </div>
          </div>
          <span className="rounded-full bg-[#eef8f6] px-3 py-1.5 text-xs font-semibold text-teal-soft">
            Fake data only
          </span>
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
          ) : (
            <DemoAccess />
          )}
        </main>
      </div>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-10px_30px_rgba(43,49,56,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {tabs.map((item) => (
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
  { value: "access" as const, label: "Access", icon: Building2 }
];
