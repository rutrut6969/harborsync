"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExpandableCard({
  title,
  subtitle,
  badge,
  children,
  className
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition open:border-[#c9d7e5]", className)}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge ? <span className="rounded-full bg-[#eef8f6] px-2.5 py-1 text-xs font-semibold text-teal-soft">{badge}</span> : null}
          <ChevronDown className="mt-1 text-slate-400 transition group-open:rotate-180" size={17} aria-hidden />
        </div>
      </summary>
      <div className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">{children}</div>
    </details>
  );
}
