import { RecordsTable } from "@/components/records/records-table";
import { auth } from "@/lib/auth";
import { getRecords } from "@/lib/data";

export default async function RecordsPage() {
  const session = await auth();
  const records = await getRecords(session?.user?.id ?? "");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Searchable history</p>
        <h1 className="text-2xl font-semibold">Records Center</h1>
      </div>
      <RecordsTable records={records} />
    </div>
  );
}
