export type PdfExportRequest = {
  recordIds: string[];
  requestedById: string;
};

export async function queueRecordsPdfExport(request: PdfExportRequest) {
  return {
    status: "queued" as const,
    requestedById: request.requestedById,
    recordCount: request.recordIds.length
  };
}
