/**
 * Export Helper Utility for MIDLEX CASE DIRECTORY
 * Supports PDF & DOCX format exports with all active filters applied.
 */

export interface DirectoryExportItem {
  sn: number;
  suitNumber: string;
  title: string;
  court: string;
  team: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  stage?: string;
  pendingTask?: string;
  status?: string;
}

export interface ExportFilterMetadata {
  query?: string;
  courtFilter?: string;
  teamFilter?: string;
  totalRecords: number;
}

/**
 * Download Case Directory as Microsoft Word (.docx) document
 */
export function downloadDirectoryAsDocx(
  items: DirectoryExportItem[],
  metadata: ExportFilterMetadata
) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const courtLabel = metadata.courtFilter && metadata.courtFilter !== 'ALL' ? metadata.courtFilter : 'All Courts';
  const teamLabel = metadata.teamFilter && metadata.teamFilter !== 'ALL' ? metadata.teamFilter : 'All Litigation Teams';
  const searchLabel = metadata.query ? `"${metadata.query}"` : 'None';

  const rowsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold; text-align: center;">${item.sn}</td>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold;">${item.title}</td>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold; color: #1e3a8a;">${item.suitNumber}</td>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-size: 11px;">${item.court}</td>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-size: 11px;">
        <strong>${item.clientName || 'N/A'}</strong><br/>
        <span style="color: #6b7280;">Tel: ${item.clientPhone || 'N/A'}</span><br/>
        <span style="color: #6b7280;">Email: ${item.clientEmail || 'N/A'}</span>
      </td>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold; color: #1d4ed8; font-size: 11px;">${item.stage || 'PLEADINGS / PRE-TRIAL'}</td>
      <td style="border: 1px solid #d1d5db; padding: 10px; font-size: 11px; color: #b45309; font-weight: bold;">${item.pendingTask || 'Filing of Written Address & Witness Statements'}</td>
    </tr>`
    )
    .join('');

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>MIDLEX CASE DIRECTORY</title>
      <style>
        body { font-family: 'Arial', sans-serif; color: #1f2937; margin: 30px; }
        .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 20px; }
        .firm-title { font-size: 24pt; font-weight: bold; color: #1e3a8a; margin: 0; }
        .doc-title { font-size: 14pt; font-weight: bold; color: #d97706; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .meta-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px; font-size: 10pt; }
        .meta-grid { width: 100%; border-collapse: collapse; }
        .meta-grid td { padding: 4px 8px; }
        .meta-label { font-weight: bold; color: #4b5563; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt; }
        table.data-table th { background-color: #1e3a8a; color: #ffffff; padding: 10px; font-weight: bold; text-transform: uppercase; border: 1px solid #1e3a8a; text-align: left; }
        .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 9pt; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="firm-title">MIDLEX LLP</h1>
        <div class="doc-title">OFFICIAL LITIGATION CASE DIRECTORY</div>
      </div>

      <div class="meta-box">
        <table class="meta-grid">
          <tr>
            <td class="meta-label">Date Generated:</td>
            <td>${currentDate}</td>
            <td class="meta-label">Total Matched Records:</td>
            <td><strong>${items.length} matters</strong></td>
          </tr>
          <tr>
            <td class="meta-label">Court Filter:</td>
            <td>${courtLabel}</td>
            <td class="meta-label">Litigation Team Filter:</td>
            <td>${teamLabel}</td>
          </tr>
          <tr>
            <td class="meta-label">Search Query:</td>
            <td colspan="3">${searchLabel}</td>
          </tr>
        </table>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 5%; text-align: center;">S/N</th>
            <th style="width: 20%;">CASES TITLE</th>
            <th style="width: 15%;">SUIT NO.</th>
            <th style="width: 15%;">COURT</th>
            <th style="width: 20%;">CLIENT DETAILS</th>
            <th style="width: 12%;">STAGE</th>
            <th style="width: 13%;">PENDING TASK</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        Confidential Document &bull; Midlex LLP Legal Practice Management System &bull; Generated on ${currentDate}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MIDLEX_CASE_DIRECTORY_${Date.now()}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download Case Directory as PDF document
 */
export function downloadDirectoryAsPdf(
  items: DirectoryExportItem[],
  metadata: ExportFilterMetadata
) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const courtLabel = metadata.courtFilter && metadata.courtFilter !== 'ALL' ? metadata.courtFilter : 'All Courts';
  const teamLabel = metadata.teamFilter && metadata.teamFilter !== 'ALL' ? metadata.teamFilter : 'All Litigation Teams';
  const searchLabel = metadata.query ? `"${metadata.query}"` : 'None';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print the PDF directory report.');
    return;
  }

  const rowsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${item.sn}</td>
      <td style="font-weight: bold; color: #111827;">${item.title}</td>
      <td style="font-weight: bold; color: #1e3a8a;">${item.suitNumber}</td>
      <td>${item.court}</td>
      <td>
        <strong>${item.clientName || 'N/A'}</strong><br/>
        <span style="color: #6b7280; font-size: 10px;">Tel: ${item.clientPhone || 'N/A'}</span><br/>
        <span style="color: #6b7280; font-size: 10px;">Email: ${item.clientEmail || 'N/A'}</span>
      </td>
      <td style="font-weight: bold; color: #1d4ed8;">${item.stage || 'PLEADINGS / PRE-TRIAL'}</td>
      <td style="font-weight: bold; color: #b45309;">${item.pendingTask || 'Filing of Written Address & Witness Statements'}</td>
    </tr>`
    )
    .join('');

  const docHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>MIDLEX CASE DIRECTORY REPORT</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; margin: 0; padding: 20px; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }
        .brand { font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: 1px; }
        .doc-title { font-size: 14px; font-weight: 700; color: #d97706; text-transform: uppercase; margin-top: 4px; }
        .meta-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; }
        .meta-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .meta-item { display: flex; gap: 6px; }
        .meta-label { font-weight: 700; color: #4b5563; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
        th { background-color: #1e3a8a; color: white; text-align: left; padding: 10px 12px; font-weight: 700; text-transform: uppercase; border: 1px solid #1e3a8a; }
        td { padding: 10px 12px; border: 1px solid #e5e7eb; vertical-align: middle; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">MIDLEX LLP</div>
          <div class="doc-title">OFFICIAL LITIGATION CASE DIRECTORY</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #6b7280;">
          <div>Generated: <strong>${currentDate}</strong></div>
          <div>Records: <strong>${items.length} matters</strong></div>
        </div>
      </div>

      <div class="meta-card">
        <div class="meta-row">
          <div class="meta-item"><span class="meta-label">Court Filter:</span> <span>${courtLabel}</span></div>
          <div class="meta-item"><span class="meta-label">Litigation Team Filter:</span> <span>${teamLabel}</span></div>
          <div class="meta-item"><span class="meta-label">Search Query:</span> <span>${searchLabel}</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 4%; text-align: center;">S/N</th>
            <th style="width: 20%;">CASES TITLE</th>
            <th style="width: 15%;">SUIT NO.</th>
            <th style="width: 15%;">COURT</th>
            <th style="width: 20%;">CLIENT DETAILS</th>
            <th style="width: 13%;">STAGE</th>
            <th style="width: 13%;">PENDING TASK</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        Confidential Legal Record &bull; Midlex LLP Practice Directory &bull; ${currentDate}
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(docHtml);
  printWindow.document.close();
}
