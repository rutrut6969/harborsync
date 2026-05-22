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
import { ArrowUpDown, Download, Search } from "lucide-react";
import { records } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type RecordRow = (typeof records)[number];

const tabs = ["Medication", "Doctor Visit", "Bloodwork", "Document", "Activity"] as const;

export function RecordsTable() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Medication");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);

  const data = useMemo(() => {
    if (activeTab === "Activity") return records;
    return records.filter((record) => record.category === activeTab);
  }, [activeTab]);

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
          <Button type="button" variant="secondary">
            <Download size={17} aria-hidden />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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
