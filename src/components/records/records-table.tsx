"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, Download, FolderSearch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { exportRecordsToPdf } from "@/lib/export";

type RecordRow = {
  id: string;
  category: string;
  patient: string;
  title: string;
  date: string;
  status: string;
};

const tabs = ["Medication", "Doctor Visit", "Bloodwork", "Document", "Activity"] as const;

export function RecordsTable({ records, demo = false }: { records: RecordRow[]; demo?: boolean }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Medication");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);

  const data = useMemo(() => {
    if (activeTab === "Activity") return records;
    return records.filter((record) => record.category === activeTab);
  }, [activeTab, records]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-100 p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`touch-target shrink-0 rounded-2xl px-4 text-sm font-semibold transition ${
                activeTab === tab ? "bg-harbor text-white" : "bg-[#f4f8fb] text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden />
            <input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search records"
              className="touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] pl-10 pr-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]"
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              exportRecordsToPdf({
                rows: table.getRowModel().rows.map((row) => row.original),
                context: `${activeTab} records${globalFilter ? ` matching "${globalFilter}"` : ""}`,
                demo
              })
            }
          >
            <Download size={17} aria-hidden />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const record = row.original;
            return <RecordCard key={record.id} record={record} />;
          })
        ) : (
          <EmptyState
            compact
            icon={FolderSearch}
            title="No records found"
            description="Try a different tab or search term."
            className="border-slate-100"
          />
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8">
                  <EmptyState
                    compact
                    icon={FolderSearch}
                    title="No records found"
                    description="Try a different tab or search term."
                    className="border-slate-100"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const columns: ColumnDef<RecordRow>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date
        <ArrowUpDown size={13} aria-hidden />
      </button>
    )
  },
  {
    accessorKey: "category",
    header: "Type"
  },
  {
    accessorKey: "patient",
    header: "Patient"
  },
  {
    accessorKey: "title",
    header: "Record"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">
        {String(getValue())}
      </span>
    )
  }
];

function RecordCard({ record }: { record: RecordRow }) {
  return (
    <details className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition active:scale-[0.99] open:border-[#c9d7e5]">
      <summary className="mb-3 flex cursor-pointer list-none items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
            {record.category}
          </span>
          <h3 className="mt-2 text-base font-semibold leading-snug">{record.title}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">
          {record.status}
        </span>
      </summary>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-[#f8fafc] p-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Patient</p>
          <p className="mt-0.5 font-medium text-slate-700">{record.patient}</p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date</p>
          <p className="mt-0.5 font-medium text-slate-700">{record.date}</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-[#f8fafc] p-3 text-sm leading-6 text-slate-600">
        <p><span className="font-semibold text-slate-deep">Record:</span> {record.title}</p>
        <p><span className="font-semibold text-slate-deep">Status:</span> {record.status}</p>
        <p><span className="font-semibold text-slate-deep">Details:</span> Notes, side effects, lab values, documents, and timestamps appear here when available.</p>
      </div>
    </details>
  );
}
