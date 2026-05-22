import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

const upload = createUploadthing();

export const ourFileRouter = {
  documentUploader: upload({
    pdf: { maxFileSize: "16MB", maxFileCount: 4 },
    image: { maxFileSize: "8MB", maxFileCount: 6 }
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return {
        userId: session.user.id
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await prisma.document.create({
        data: {
          title: file.name,
          type: file.type?.startsWith("image/") ? "IMAGE" : "PDF",
          fileUrl: file.url,
          fileKey: file.key,
          mimeType: file.type ?? "application/octet-stream",
          sizeBytes: file.size,
          uploadedById: metadata.userId
        }
      });

      await writeAuditLog({
        actorId: metadata.userId,
        action: "DOCUMENT_UPLOADED",
        message: `Document uploaded: ${file.name}`
      });

      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
