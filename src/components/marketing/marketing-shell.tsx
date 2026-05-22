import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-slate-deep">
      <PublicNav />
      {children}
      <PublicFooter />
    </div>
  );
}
