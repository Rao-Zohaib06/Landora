import Papa from 'papaparse';
import XLSX from 'xlsx';

export const parseCSV = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const csvString = fileBuffer.toString('utf-8');
    
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
          meta: results.meta,
        });
      },
      error: (error) => {
        reject(error);
      },
      ...options,
    });
  });
};

export const parseExcel = (fileBuffer) => {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    });

    // Convert to objects with headers
    if (data.length === 0) {
      return { data: [], errors: [] };
    }

    const headers = data[0];
    const rows = data.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return {
      data: rows,
      errors: [],
    };
  } catch (error) {
    throw new Error(`Excel parsing error: ${error.message}`);
  }
};

export const matchBankTransaction = (transaction, ledgerEntries) => {
  const { amount, date, description } = transaction;
  
  // Try to match by amount and date (within 7 days)
  const matches = ledgerEntries.filter((entry) => {
    const amountMatch = Math.abs(entry.amount - Math.abs(amount)) < 0.01;
    const dateMatch =
      Math.abs(new Date(entry.date) - new Date(date)) / (1000 * 60 * 60 * 24) <= 7;
    const descriptionMatch =
      description.toLowerCase().includes(entry.description.toLowerCase()) ||
      entry.description.toLowerCase().includes(description.toLowerCase());

    return amountMatch && (dateMatch || descriptionMatch);
  });

  return matches.length > 0 ? matches[0] : null;
};

