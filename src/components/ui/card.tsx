import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section className={cn("rounded-2xl border border-white bg-white p-4 calm-shadow", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  action
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-slate-deep">{title}</h2>
      {action}
    </div>
  );
}
