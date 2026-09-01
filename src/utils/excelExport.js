import * as XLSX from 'xlsx';

/**
 * Export .xlsx file using explicit OpenXML Spreadsheet Blob
 */
export const exportRecordsToExcel = (records, filterDescription = "All Records") => {
  if (!records || records.length === 0) {
    alert("No records available to export.");
    return;
  }

  // 1. Format clean data rows
  const ledgerRows = records.map((rec, index) => ({
    "S.No": index + 1,
    "Donor Name": rec.name,
    "Address / Location": rec.address,
    "Amount (INR)": Number(rec.amount) || 0,
    "Date": rec.date,
    "Time": rec.time || "",
    "Receipt Proof": rec.imageUrl ? "Yes" : "No",
    "Notes": rec.notes || ""
  }));

  const ledgerWorksheet = XLSX.utils.json_to_sheet(ledgerRows);

  ledgerWorksheet['!cols'] = [
    { wch: 8 },  // S.No
    { wch: 25 }, // Donor Name
    { wch: 30 }, // Address
    { wch: 15 }, // Amount
    { wch: 14 }, // Date
    { wch: 12 }, // Time
    { wch: 16 }, // Receipt Proof
    { wch: 30 }  // Notes
  ];

  const totalAmount = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalDonors = records.length;

  const summaryRows = [
    { Parameter: "Organization", Value: "TMCF Church Reconstruction Fund" },
    { Parameter: "Report Type", Value: "Official Collection Ledger" },
    { Parameter: "Generated On", Value: new Date().toLocaleString('en-IN') },
    { Parameter: "Filter Applied", Value: filterDescription },
    { Parameter: "Total Records", Value: totalDonors },
    { Parameter: "Total Collected (INR)", Value: totalAmount },
    { Parameter: "Pastor", Value: "Pallapati Cornelius" }
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryRows);
  summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 40 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ledgerWorksheet, "Collection Ledger");
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

  // Binary XLSX buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Explicit XLSX MIME type to prevent browsers from naming it .zip
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `TMCF_Church_Collection_Ledger_${dateStamp}.xlsx`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};

/**
 * Export native Excel Spreadsheet (.xls) formatted document.
 * Opens 100% directly in Microsoft Excel / Excel Mobile without any Zip format issue.
 */
export const exportRecordsToNativeExcel = (records) => {
  if (!records || records.length === 0) {
    alert("No records available to export.");
    return;
  }

  const totalAmount = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>TMCF Ledger</x:Name>
            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      th { background-color: #0f172a; color: #ffffff; font-weight: bold; font-family: Arial, sans-serif; padding: 10px; border: 1px solid #cbd5e1; }
      td { font-family: Arial, sans-serif; padding: 8px; border: 1px solid #cbd5e1; }
      .amount { color: #059669; font-weight: bold; }
      .title { font-size: 16pt; font-weight: bold; color: #d97706; font-family: Arial, sans-serif; }
    </style>
  </head>
  <body>
    <table>
      <tr><td colspan="8" class="title">TMCF Church Reconstruction Fund - Official Collection Ledger</td></tr>
      <tr><td colspan="8">Supervising Pastor: Pallapati Cornelius | Generated: ${new Date().toLocaleString('en-IN')}</td></tr>
      <tr><td colspan="8">Total Amount Collected: Rs. ${totalAmount.toLocaleString('en-IN')} (${records.length} Records)</td></tr>
      <tr></tr>
      <tr style="background-color: #0f172a; color: #ffffff;">
        <th>S.No</th>
        <th>Donor Name</th>
        <th>Address / Location</th>
        <th>Amount (INR)</th>
        <th>Date</th>
        <th>Time</th>
        <th>Receipt Proof</th>
        <th>Notes / Payment Ref</th>
      </tr>`;

  records.forEach((rec, idx) => {
    html += `<tr>
      <td>${idx + 1}</td>
      <td><b>${rec.name}</b></td>
      <td>${rec.address}</td>
      <td class="amount">${rec.amount}</td>
      <td>${rec.date}</td>
      <td>${rec.time || ''}</td>
      <td>${rec.imageUrl ? 'Yes' : 'No'}</td>
      <td>${rec.notes || ''}</td>
    </tr>`;
  });

  html += `
      <tr style="font-weight: bold; background-color: #f1f5f9;">
        <td colspan="3" style="text-align: right;">Total Amount Collected:</td>
        <td class="amount">${totalAmount}</td>
        <td colspan="4"></td>
      </tr>
    </table>
  </body>
  </html>`;

  const blob = new Blob(["\ufeff" + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `TMCF_Church_Collection_Ledger_${dateStamp}.xls`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};

/**
 * Export CSV format (Opens universally in Microsoft Excel, Google Sheets, WPS Office)
 */
export const exportRecordsToCSV = (records) => {
  if (!records || records.length === 0) {
    alert("No records available to export.");
    return;
  }

  const ledgerRows = records.map((rec, index) => ({
    "S.No": index + 1,
    "Donor Name": rec.name,
    "Address": rec.address,
    "Amount (INR)": Number(rec.amount) || 0,
    "Date": rec.date,
    "Time": rec.time || "",
    "Receipt Attached": rec.imageUrl ? "Yes" : "No",
    "Notes": rec.notes || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(ledgerRows);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  // UTF-8 BOM (\ufeff) allows Microsoft Excel to open CSV natively with correct column alignment
  const blob = new Blob(["\ufeff" + csvOutput], { type: 'text/csv;charset=utf-8;' });
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `TMCF_Church_Collection_${dateStamp}.csv`;

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};
