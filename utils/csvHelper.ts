import { BulkLead } from '../types';
// @ts-ignore
import { read, utils } from 'xlsx';

export const SHEET_HEADERS = ['Recipient Name', 'Recipient Email', 'Company Name', 'Website URL'];

export const downloadTemplate = () => {
  // We keep the template as CSV because it's universally compatible with Excel
  // and requires no heavy library to generate.
  const headers = SHEET_HEADERS.join(',');
  const example = 'John Doe,john@example.com,Acme Corp,www.acmecorp.com';
  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + "\n" + example);
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", "leads_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseSpreadsheet = async (file: File): Promise<BulkLead[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        
        // Read the workbook (supports xlsx, xls, csv)
        const workbook = read(data, { type: 'array' });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON (array of arrays)
        // header: 1 results in an array of arrays: [['Name', 'Email'...], ['John', 'john@...']]
        const rows: any[][] = utils.sheet_to_json(worksheet, { header: 1 });
        
        if (!rows || rows.length < 2) {
            resolve([]);
            return;
        }

        const leads: BulkLead[] = [];
        
        // Skip header row (index 0)
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          // We check if the row is not empty.
          // Assuming column mapping matches our template:
          // Col 0: Name, Col 1: Email, Col 2: Company, Col 3: Website
          
          const recipientName = row[0] ? String(row[0]).trim() : '';
          const recipientCompany = row[2] ? String(row[2]).trim() : '';
          
          // Ensure we have at least Name and Company to make a valid pitch
          if (recipientName && recipientCompany) {
             leads.push({
                id: `lead-${i}-${Date.now()}`,
                recipientName: recipientName,
                recipientEmail: row[1] ? String(row[1]).trim() : undefined,
                recipientCompany: recipientCompany,
                recipientWebsite: row[3] ? String(row[3]).trim() : undefined
             });
          }
        }
        resolve(leads);
      } catch (err) {
        console.error("Error parsing spreadsheet:", err);
        reject(new Error("Failed to parse spreadsheet file. Please ensure it is a valid Excel or CSV file."));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    
    // Read as ArrayBuffer to support XLSX
    reader.readAsArrayBuffer(file);
  });
};