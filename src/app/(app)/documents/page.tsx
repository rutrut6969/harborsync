import { FilePlus2, LockKeyhole, Upload } from "lucide-react";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { getDocuments } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";

export default async function DocumentsPage() {
  const session = await auth();
  const documents = await getDocuments(session?.user.id ?? "");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Secure uploads</p>
        <h1 className="text-2xl font-semibold">Documents</h1>
      </div>

      <Card>
        <div className="rounded-2xl border border-dashed border-[#bfd4e7] bg-[#f8fbfd] p-5 text-center">
          <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-[#e8f1f8] text-harbor">
            <Upload size={22} aria-hidden />
          </div>
          <p className="font-semibold">Upload PDFs, images, lab results, or doctor paperwork</p>
          <p className="mt-1 text-sm text-slate-500">Attach each upload to a child, case, or log entry.</p>
          <Button className="mt-4" type="button">
            <FilePlus2 size={18} aria-hidden />
            Choose file
          </Button>
        </div>
        <div className="mt-4 flex gap-3 rounded-2xl bg-[#eef8f6] p-3 text-sm text-slate-600">
          <LockKeyhole className="shrink-0 text-teal-soft" size={18} aria-hidden />
          <p>UploadThing route scaffolding is included for authenticated uploads with server-side attachment metadata.</p>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Recent Documents" />
        <div className="space-y-3">
          {documents.map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3">
              <div>
                <p className="font-semibold">{document.title}</p>
                <p className="text-sm text-slate-500">
                  {document.child?.fullName ?? "Case file"} · {format(document.createdAt, "MMM d, yyyy")}
                </p>
              </div>
              <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-xs font-semibold text-harbor">
                {document.type.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
