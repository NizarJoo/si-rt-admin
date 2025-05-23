import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export data ke PDF dengan tabel.
 * @param {string} title - Judul laporan PDF.
 * @param {Array<string>} headers - Array kolom header tabel.
 * @param {Array<Array<any>>} rows - Array isi tabel (nested array per row).
 * @param {string} fileName - Nama file untuk di-download.
 */
export const exportToPDF = (title, headers, rows, fileName) => {
  const doc = new jsPDF();

  // Tambah judul
  doc.text(title, 14, 20);

  // Tabel
  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows,
  });

  // Simpan PDF
  doc.save(fileName);
};
