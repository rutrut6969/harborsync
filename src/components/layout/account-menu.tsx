"use client";

import Link from "next/link";
import { Building2, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOutUser } from "@/app/actions/session";
import { cn } from "@/lib/utils";

type AccountMenuProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function AccountMenu({ user }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="touch-target flex items-center gap-3 rounded-2xl border border-white bg-white px-2.5 py-2 text-left shadow-sm transition hover:bg-[#f8fbfd] focus:outline-none focus:ring-4 focus:ring-[#dfeaf5]"
      >
        <div className="grid size-9 place-items-center rounded-xl bg-[#e8f1f8] text-sm font-bold text-harbor">
          {initials(user?.name ?? user?.email ?? "HS")}
        </div>
        <div className="hidden max-w-[12rem] md:block">
          <p className="truncate text-sm font-medium">{user?.name ?? "Care team"}</p>
          <p className="truncate text-xs text-slate-500">{user?.email ?? "Secure workspace"}</p>
        </div>
        <ChevronDown className={cn("text-slate-400 transition", open && "rotate-180")} size={16} aria-hidden />
      </button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 top-14 z-50 w-72 origin-top-right rounded-2xl border border-white bg-white p-2 calm-shadow transition",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="border-b border-slate-100 px-3 py-3">
          <p className="font-semibold">{user?.name ?? "HarborSync user"}</p>
          <p className="truncate text-sm text-slate-500">{user?.email}</p>
        </div>
        <MenuLink href="/profile" icon={UserRound} label="Profile" onClick={() => setOpen(false)} />
        <MenuLink href="/profile" icon={Settings} label="Account Settings" onClick={() => setOpen(false)} />
        <MenuLink href="/profile" icon={Building2} label="Organization Access" onClick={() => setOpen(false)} />
        <form action={signOutUser} className="mt-1 border-t border-slate-100 pt-1">
          <button
            type="submit"
            role="menuitem"
            className="touch-target flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-error-muted transition hover:bg-[#fff7f7]"
          >
            <LogOut size={17} aria-hidden />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onClick}
      className="touch-target flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#eef4fa] hover:text-harbor"
    >
      <Icon size={17} aria-hidden />
      {label}
    </Link>
  );
}

function initials(value: string) {
  return value
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
