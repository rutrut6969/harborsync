import { AddLogForm } from "@/components/logs/add-log-form";

export default function AddLogPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  return <AddLogPageContent searchParams={searchParams} />;
}

async function AddLogPageContent({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  return <AddLogForm initialType={params.type} />;
}
