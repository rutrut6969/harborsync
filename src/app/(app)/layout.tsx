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
    select: { passwordHash: true, onboardingCompleted: true, platformRole: true }
  });

  if (!user?.passwordHash) {
    redirect("/set-password");
  }

  if (user.platformRole === "SUPER_ADMIN" || user.platformRole === "PLATFORM_ADMIN") {
    redirect("/admin");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
