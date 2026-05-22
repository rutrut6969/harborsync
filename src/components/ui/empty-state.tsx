import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, compact, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[#cbd9e7] bg-[#f8fbfd] p-5 text-center",
        compact && "p-4",
        className
      )}
    >
      <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-[#e8f1f8] text-harbor">
        <Icon size={22} aria-hidden />
      </div>
      <p className="font-semibold text-slate-deep">{title}</p>
      {description ? <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
