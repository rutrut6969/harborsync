"use client";

import { FilePlus2, FileText, ImageIcon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PreviewFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
};

export function UploadPanel() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const nextFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 100
    }));

    setFiles((current) => [...nextFiles, ...current].slice(0, 6));
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border border-dashed p-5 text-center transition",
          isDragging ? "border-harbor bg-[#eef4fa]" : "border-[#bfd4e7] bg-[#f8fbfd]"
        )}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          multiple
          accept="application/pdf,image/*"
          onChange={(event) => addFiles(event.target.files)}
        />
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-[#e8f1f8] text-harbor">
          <Upload size={22} aria-hidden />
        </div>
        <p className="font-semibold">Upload PDFs, images, lab results, or doctor paperwork</p>
        <p className="mt-1 text-sm text-slate-500">Drag files here on desktop, or tap below on mobile.</p>
        <Button className="mt-4" type="button" onClick={() => inputRef.current?.click()}>
          <FilePlus2 size={18} aria-hidden />
          Choose file
        </Button>
      </div>

      {files.length ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="rounded-2xl border border-slate-100 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#f4f8fb] text-harbor">
                  {file.type.startsWith("image/") ? <ImageIcon size={18} aria-hidden /> : <FileText size={18} aria-hidden />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(file.size)} - Ready for UploadThing handoff</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8eef5]">
                <div className="h-full rounded-full bg-teal-soft transition-all" style={{ width: `${file.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
