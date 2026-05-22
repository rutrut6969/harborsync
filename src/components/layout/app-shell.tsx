import Link from "next/link";
import { FileText, Home, PlusCircle, FolderOpen } from "lucide-react";
import { AccountMenu } from "@/components/layout/account-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationsPopover } from "@/components/layout/notifications-popover";

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
    <div className="min-h-screen scroll-pb-28 pb-28 text-slate-deep md:pb-0">
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
            <NotificationsPopover />
            <AccountMenu user={user} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 md:grid-cols-[13rem_minmax(0,1fr)] md:py-8">
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
        <main className="min-w-0">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}

const desktopLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/records", label: "Records", icon: FolderOpen },
  { href: "/add-log", label: "Add Log", icon: PlusCircle },
  { href: "/documents", label: "Documents", icon: FileText }
];
