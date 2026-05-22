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
      childOptions={[
        ...(session?.user?.id
          ? [{
              id: `user:${session.user.id}`,
              name: `${session.user.name ?? session.user.email ?? "Me"} - Self`
            }]
          : []),
        ...children.map((child) => ({
          id: `child:${child.id}`,
          name: `${child.fullName} - Child`
        }))
      ]}
    />
  );
}
