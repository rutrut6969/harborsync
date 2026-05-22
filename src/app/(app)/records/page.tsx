import { RecordsTable } from "@/components/records/records-table";

export default function RecordsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Searchable history</p>
        <h1 className="text-2xl font-semibold">Records Center</h1>
      </div>
      <RecordsTable />
    </div>
  );
}
