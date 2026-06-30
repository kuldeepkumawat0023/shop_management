const PDFDocument = require('pdfkit');
const { formatCurrency, formatShortDate } = require('../utils/formatHelpers');

/**
 * Generate Invoice PDF using PDFKit
 * @param {Object} invoiceData Contains shop, customer/supplier, and items data
 * @param {Object} res Express response object to pipe the PDF
 */
const generateInvoicePDF = (invoiceData, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      // Pipe the PDF into the response
      doc.pipe(res);

      const { shop, entity, invoiceNumber, date, items, netAmount, type } = invoiceData;

      // Header
      doc.fontSize(20).text(shop.name || 'Shop Name', { align: 'center' });
      doc.fontSize(10).text(shop.address || 'Shop Address', { align: 'center' });
      doc.text(`Mobile: ${shop.contactNumber || ''}`, { align: 'center' });
      if (shop.gstNumber) {
        doc.text(`GST: ${shop.gstNumber}`, { align: 'center' });
      }
      
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Invoice Info
      doc.fontSize(14).text(`${type === 'SALE' ? 'TAX INVOICE' : 'PURCHASE BILL'}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(10);
      const startY = doc.y;
      
      // Left side (Entity Details)
      doc.text(`To: ${entity.name}`, 50, startY);
      doc.text(`Mobile: ${entity.mobile}`, 50, startY + 15);
      if (entity.address) doc.text(`Address: ${entity.address}`, 50, startY + 30);
      if (entity.gstNumber) doc.text(`GST: ${entity.gstNumber}`, 50, startY + 45);

      // Right side (Invoice Details)
      doc.text(`Invoice No: ${invoiceNumber}`, 400, startY);
      doc.text(`Date: ${formatShortDate(date)}`, 400, startY + 15);

      doc.moveDown(4);

      // Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 250, tableTop, { width: 50, align: 'right' });
      doc.text('Price', 320, tableTop, { width: 80, align: 'right' });
      doc.text('GST %', 420, tableTop, { width: 50, align: 'right' });
      doc.text('Total', 480, tableTop, { width: 70, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      doc.font('Helvetica');

      // Table Rows
      let y = tableTop + 25;
      items.forEach(item => {
        doc.text(item.name, 50, y);
        doc.text(item.quantity.toString(), 250, y, { width: 50, align: 'right' });
        doc.text(formatCurrency(item.price), 320, y, { width: 80, align: 'right' });
        doc.text(item.gstRate.toString(), 420, y, { width: 50, align: 'right' });
        doc.text(formatCurrency(item.total), 480, y, { width: 70, align: 'right' });
        y += 20;
      });

      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 15;

      // Totals
      doc.font('Helvetica-Bold');
      doc.text('Net Amount:', 350, y, { width: 120, align: 'right' });
      doc.text(formatCurrency(netAmount), 480, y, { width: 70, align: 'right' });

      doc.moveDown(3);
      doc.font('Helvetica');
      doc.text('Thank you for your business!', { align: 'center' });

      doc.end();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF
};
