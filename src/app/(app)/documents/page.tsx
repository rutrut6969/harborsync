import { FileText, LockKeyhole } from "lucide-react";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { getDocuments } from "@/lib/data";
import { UploadPanel } from "@/components/documents/upload-panel";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DocumentsPage() {
  const session = await auth();
  const documents = await getDocuments(session?.user?.id ?? "");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Secure uploads</p>
        <h1 className="text-2xl font-semibold">Documents</h1>
      </div>

      <Card>
        <UploadPanel />
        <div className="mt-4 flex gap-3 rounded-2xl bg-[#eef8f6] p-3 text-sm text-slate-600">
          <LockKeyhole className="shrink-0 text-teal-soft" size={18} aria-hidden />
          <p>UploadThing route scaffolding is included for authenticated uploads with server-side attachment metadata.</p>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Recent Documents" />
        <div className="space-y-3">
          {documents.length ? (
            documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3">
                <div>
                  <p className="font-semibold">{document.title}</p>
                  <p className="text-sm text-slate-500">
                    {document.child?.fullName ?? "Case file"} - {format(document.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
                <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
                  {document.type.replace("_", " ")}
                </span>
              </div>
            ))
          ) : (
            <EmptyState
              compact
              icon={FileText}
              title="No documents yet"
              description="Uploaded lab results, doctor paperwork, and case files will appear here."
            />
          )}
        </div>
      </Card>
    </div>
  );
}
