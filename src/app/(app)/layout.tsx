import { auth } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
