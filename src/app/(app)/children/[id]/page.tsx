import { notFound } from "next/navigation";
import { HeartPulse, Phone, UserRound } from "lucide-react";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { getChildForUser } from "@/lib/data";
import { Card, SectionHeader } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";

export default async function ChildPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const child = await getChildForUser(session?.user?.id ?? "", id);
  if (!child) notFound();
  const emergencyContacts = parseEmergencyContacts(child.emergencyContacts);

  return (
    <div className="space-y-5">
      <BackButton />
      <Card>
        <div className="flex items-start gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#e8f1f8] text-harbor">
            <UserRound size={26} aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-soft">Child Profile</p>
            <h1 className="text-2xl font-semibold">{child.fullName}</h1>
            <p className="text-sm text-slate-500">DOB {format(child.dateOfBirth, "MMM d, yyyy")}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Health Snapshot" />
          <div className="space-y-3 text-sm">
            <Info label="Allergies" value={child.allergies} />
            <Info label="Conditions" value={child.conditions} />
            <Info label="Current medications" value={child.currentMedications ?? "None documented"} />
            <Info label="Primary doctor" value={child.primaryDoctor ?? "Not documented"} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Emergency Contacts" />
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={`${contact.name}-${index}`} className="flex gap-3 rounded-2xl bg-[#f4f8fb] p-3">
                {index === 0 ? (
                  <Phone className="text-harbor" size={19} aria-hidden />
                ) : (
                  <HeartPulse className="text-teal-soft" size={19} aria-hidden />
                )}
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-slate-500">{contact.relationship} · {contact.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl bg-[#f8fafc] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value ?? "None documented"}</p>
    </div>
  );
}

type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

function parseEmergencyContacts(value: unknown): EmergencyContact[] {
  if (!Array.isArray(value)) return [];

  return value.filter((contact): contact is EmergencyContact => {
    return (
      typeof contact === "object" &&
      contact !== null &&
      "name" in contact &&
      "relationship" in contact &&
      "phone" in contact &&
      typeof contact.name === "string" &&
      typeof contact.relationship === "string" &&
      typeof contact.phone === "string"
    );
  });
}
