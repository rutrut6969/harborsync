import Link from "next/link";
import { Bell, FileText, Home, PlusCircle, UserRound, FolderOpen } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

type AppShellProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-24 text-slate-deep md:pb-0">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-harbor text-lg font-bold text-white shadow-sm">
              H
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">HarborSync</p>
              <p className="text-xs text-slate-500">Connected Family Coordination</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" className="touch-target grid size-11 place-items-center rounded-full border border-white bg-white text-slate-500 shadow-sm transition hover:text-harbor">
              <Bell size={19} aria-hidden />
              <span className="sr-only">Notifications</span>
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.name ?? "Care team"}</p>
              <p className="text-xs text-slate-500">{user?.email ?? "Secure workspace"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 md:grid-cols-[13rem_1fr] md:py-8">
        <aside className="hidden md:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-white bg-white/80 p-2 calm-shadow">
            {desktopLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-[#eef4fa] hover:text-harbor"
              >
                <item.icon size={18} aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}

const desktopLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/records", label: "Records", icon: FolderOpen },
  { href: "/add-log", label: "Add Log", icon: PlusCircle },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserRound }
];
