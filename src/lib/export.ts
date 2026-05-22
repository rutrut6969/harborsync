export type PdfRecordRow = {
  id: string;
  category: string;
  patient: string;
  title: string;
  date: string;
  status: string;
};

export function exportRecordsToPdf({
  rows,
  context,
  demo = false
}: {
  rows: PdfRecordRow[];
  context: string;
  demo?: boolean;
}) {
  const generatedAt = new Date().toLocaleString();
  const documentHtml = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>HarborSync Records Export</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; color: #2B3138; margin: 32px; }
          header { border-bottom: 2px solid #DCE4EE; padding-bottom: 16px; margin-bottom: 24px; }
          h1 { margin: 0; color: #3A6EA5; font-size: 28px; }
          .tagline { color: #667085; margin-top: 4px; }
          .meta { margin-top: 16px; font-size: 13px; color: #667085; }
          .demo { display: inline-block; margin-top: 12px; padding: 6px 10px; border-radius: 999px; background: #eef8f6; color: #2f7771; font-weight: 700; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; background: #F5F7FA; color: #667085; padding: 10px; border-bottom: 1px solid #DCE4EE; }
          td { padding: 10px; border-bottom: 1px solid #EEF2F6; vertical-align: top; }
          .status { font-weight: 700; color: #4FA7A0; }
          footer { margin-top: 24px; color: #667085; font-size: 12px; }
          @media print { button { display: none; } body { margin: 20px; } }
        </style>
      </head>
      <body>
        <header>
          <h1>HarborSync</h1>
          <div class="tagline">Connected Family Coordination</div>
          ${demo ? '<div class="demo">Demo Mode - sample data only</div>' : ""}
          <div class="meta">Generated: ${escapeHtml(generatedAt)}<br/>Export context: ${escapeHtml(context)}<br/>Visible rows: ${rows.length}</div>
        </header>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Patient</th>
              <th>Record</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `<tr>
                  <td>${escapeHtml(row.date)}</td>
                  <td>${escapeHtml(row.category)}</td>
                  <td>${escapeHtml(row.patient)}</td>
                  <td>${escapeHtml(row.title)}</td>
                  <td class="status">${escapeHtml(row.status)}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <footer>This export includes only the records visible to the current HarborSync view.</footer>
        <script>window.addEventListener("load", () => window.print());</script>
      </body>
    </html>`;

  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!printWindow) return false;
  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
  return true;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
