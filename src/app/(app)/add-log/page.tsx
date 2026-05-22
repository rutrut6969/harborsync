import { AddLogForm } from "@/components/logs/add-log-form";
import { auth } from "@/lib/auth";
import { getAccessibleChildren } from "@/lib/data";

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
  const session = await auth();
  const children = await getAccessibleChildren(session?.user?.id ?? "");

  return (
    <AddLogForm
      initialType={params.type}
      childOptions={children.map((child) => ({
        id: child.id,
        name: child.fullName
      }))}
    />
  );
}
