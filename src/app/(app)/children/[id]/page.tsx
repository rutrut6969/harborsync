import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, HeartPulse, Phone, UserRound } from "lucide-react";
import { children } from "@/lib/demo-data";
import { Card, SectionHeader } from "@/components/ui/card";

export default async function ChildPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const child = children.find((item) => item.id === id);
  if (!child) notFound();

  return (
    <div className="space-y-5">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-harbor">
        <ArrowLeft size={16} aria-hidden />
        Back
      </Link>
      <Card>
        <div className="flex items-start gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#e8f1f8] text-harbor">
            <UserRound size={26} aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-soft">Child Profile</p>
            <h1 className="text-2xl font-semibold">{child.name}</h1>
            <p className="text-sm text-slate-500">DOB {child.dob}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Health Snapshot" />
          <div className="space-y-3 text-sm">
            <Info label="Allergies" value={child.allergies} />
            <Info label="Conditions" value={child.conditions} />
            <Info label="Current medications" value={child.medications} />
            <Info label="Primary doctor" value={child.doctor} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Emergency Contacts" />
          <div className="space-y-3">
            <div className="flex gap-3 rounded-2xl bg-[#f4f8fb] p-3">
              <Phone className="text-harbor" size={19} aria-hidden />
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-slate-500">Parent · (555) 010-4100</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-2xl bg-[#f4f8fb] p-3">
              <HeartPulse className="text-teal-soft" size={19} aria-hidden />
              <div>
                <p className="font-medium">Dr. Lena Ortiz</p>
                <p className="text-sm text-slate-500">Primary doctor · (555) 010-2200</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fafc] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
