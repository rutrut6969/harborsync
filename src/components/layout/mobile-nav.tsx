"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderOpen, Home, PlusCircle, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/records", label: "Records", icon: FolderOpen },
  { href: "/add-log", label: "Add Log", icon: PlusCircle },
  { href: "/documents", label: "Docs", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-10px_30px_rgba(43,49,56,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex flex-col items-center justify-center gap-1 rounded-2xl text-[0.7rem] font-medium text-slate-500 transition",
                isActive && "bg-[#e8f1f8] text-harbor"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
