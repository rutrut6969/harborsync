import { auth } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true }
  });

  if (!user?.passwordHash) {
    redirect("/set-password");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
