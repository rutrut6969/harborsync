import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "touch-target inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-harbor text-white shadow-sm hover:bg-[#315f90]",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-deep hover:bg-slate-50",
        variant === "quiet" && "bg-transparent text-harbor hover:bg-[#e8f1f8]",
        variant === "danger" && "bg-error-muted text-white hover:bg-[#b85d5d]",
        className
      )}
      {...props}
    />
  );
}
