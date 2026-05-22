"use client";

import { Bell, Inbox } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
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
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="touch-target grid size-11 place-items-center rounded-full border border-white bg-white text-slate-500 shadow-sm transition hover:text-harbor focus:outline-none focus:ring-4 focus:ring-[#dfeaf5]"
      >
        <Bell size={19} aria-hidden />
        <span className="sr-only">Notifications</span>
      </button>
      <div
        className={cn(
          "fixed left-4 right-4 top-[4.5rem] z-50 origin-top rounded-2xl border border-white bg-white p-3 calm-shadow transition sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-[22rem] sm:origin-top-right",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="font-semibold">Notifications</p>
          <span className="rounded-full bg-[#f4f8fb] px-2 py-1 text-xs font-semibold text-slate-500">0 new</span>
        </div>
        <div className="max-h-[22rem] overflow-y-auto">
          <EmptyState
            compact
            icon={Inbox}
            title="No notifications yet"
            description="Updates, reminders, uploads, and case activity will appear here."
            className="border-slate-100 bg-[#f8fafc]"
          />
        </div>
      </div>
    </div>
  );
}
