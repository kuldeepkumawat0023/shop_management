const PDFDocument = require('pdfkit');
const { formatCurrency, formatShortDate } = require('../utils/formatHelpers');

/**
 * Generate Invoice PDF using PDFKit
 * @param {Object} invoiceData Contains shop, customer/supplier, cashier, items data, and financials
 * @param {Object} res Express response object to pipe the PDF
 */
const generateInvoicePDF = (invoiceData, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });

      // Pipe the PDF into the response
      doc.pipe(res);

      const {
        shop = {},
        entity = {},
        cashier = 'Cashier',
        invoiceNumber,
        date,
        items = [],
        discountAmount = 0,
        taxAmount = 0,
        netAmount = 0,
        paidAmount = 0,
        paymentMethod = 'Cash',
        paymentStatus = 'Paid',
        type = 'SALE'
      } = invoiceData;

      // ─── Header Band ──────────────────────────────────────────────────────────
      doc.rect(40, 40, 515, 65).fill('#f0f9ff'); // Light sky background container
      doc.fillColor('#00668a').fontSize(18).font('Helvetica-Bold')
        .text(shop.name || 'RETAIL STORE', 55, 50, { width: 340 });

      doc.fillColor('#334155').fontSize(9).font('Helvetica')
        .text(shop.address || 'Store Location', 55, 72, { width: 340 })
        .text(`Phone: ${shop.contactNumber || '—'} | Email: ${shop.email || '—'}`, 55, 84, { width: 340 });

      if (shop.gstNumber) {
        doc.text(`GSTIN: ${shop.gstNumber}`, 55, 96, { width: 340 });
      }

      // Document Type Badge (Right aligned)
      doc.fillColor('#0ea5e9').fontSize(16).font('Helvetica-Bold')
        .text(type === 'SALE' ? 'TAX INVOICE' : 'PURCHASE BILL', 360, 52, { width: 180, align: 'right' });
      doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold')
        .text(`# ${invoiceNumber}`, 360, 72, { width: 180, align: 'right' });
      doc.fillColor('#64748b').fontSize(9).font('Helvetica')
        .text(`Date: ${formatShortDate(date)}`, 360, 86, { width: 180, align: 'right' });

      doc.y = 118;

      // ─── Info Grid (Entity & Cashier) ─────────────────────────────────────────
      const infoTop = doc.y;
      
      // Customer Box
      doc.rect(40, infoTop, 250, 65).stroke('#e2e8f0');
      doc.rect(40, infoTop, 250, 18).fill('#f8fafc');
      doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold')
        .text(type === 'SALE' ? 'CUSTOMER DETAILS' : 'SUPPLIER DETAILS', 48, infoTop + 5);
      
      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold')
        .text(entity.name || 'Walk-in Customer', 48, infoTop + 24);
      doc.fillColor('#475569').fontSize(8.5).font('Helvetica')
        .text(`Phone: ${entity.mobile || '—'}`, 48, infoTop + 36);
      if (entity.address) {
        doc.text(`Address: ${entity.address}`, 48, infoTop + 48, { width: 235 });
      }

      // Cashier & Transaction Specs Box
      doc.rect(305, infoTop, 250, 65).stroke('#e2e8f0');
      doc.rect(305, infoTop, 250, 18).fill('#f8fafc');
      doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold')
        .text('BILLING & OPERATOR INFO', 313, infoTop + 5);

      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold')
        .text(`Billed By: ${cashier}`, 313, infoTop + 24);
      doc.fillColor('#475569').fontSize(8.5).font('Helvetica')
        .text(`Payment Mode: ${paymentMethod.toUpperCase()}`, 313, infoTop + 36)
        .text(`Status: ${paymentStatus.toUpperCase()}`, 313, infoTop + 48);

      doc.y = infoTop + 78;

      // ─── Items Table ─────────────────────────────────────────────────────────
      const tableTop = doc.y;
      doc.rect(40, tableTop, 515, 22).fill('#0f172a');
      
      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold');
      doc.text('#', 48, tableTop + 6, { width: 25 });
      doc.text('Item Description', 75, tableTop + 6, { width: 230 });
      doc.text('Qty', 310, tableTop + 6, { width: 45, align: 'center' });
      doc.text('Rate', 360, tableTop + 6, { width: 60, align: 'right' });
      doc.text('GST %', 425, tableTop + 6, { width: 40, align: 'center' });
      doc.text('Amount', 470, tableTop + 6, { width: 75, align: 'right' });

      let y = tableTop + 26;
      doc.font('Helvetica').fontSize(8.5);

      items.forEach((item, index) => {
        if (y > 700) {
          doc.addPage({ margin: 40, size: 'A4' });
          y = 50;
        }

        if (index % 2 === 1) {
          doc.rect(40, y - 4, 515, 18).fill('#f8fafc');
        }

        doc.fillColor('#64748b').text((index + 1).toString(), 48, y, { width: 25 });
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(item.name || 'Item', 75, y, { width: 230 });
        doc.font('Helvetica').fillColor('#334155');
        doc.text(item.quantity.toString(), 310, y, { width: 45, align: 'center' });
        doc.text(formatCurrency(item.price), 360, y, { width: 60, align: 'right' });
        doc.text(`${item.gstRate || 0}%`, 425, y, { width: 40, align: 'center' });
        doc.text(formatCurrency(item.total || (item.quantity * item.price)), 470, y, { width: 75, align: 'right' });

        y += 18;
      });

      doc.moveTo(40, y + 2).lineTo(555, y + 2).stroke('#e2e8f0');
      y += 10;

      // ─── Financial Ledger & Summary ──────────────────────────────────────────
      const ledgerWidth = 220;
      const ledgerLeft = 335;
      
      doc.rect(ledgerLeft, y, ledgerWidth, 90).stroke('#e2e8f0');

      const drawLedgerRow = (label, val, rowY, isBold = false, color = '#334155') => {
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5).fillColor(color);
        doc.text(label, ledgerLeft + 10, rowY);
        doc.text(val, ledgerLeft + 10, rowY, { width: ledgerWidth - 20, align: 'right' });
      };

      let ledgerY = y + 6;
      if (discountAmount > 0) {
        drawLedgerRow('Discount:', `- ${formatCurrency(discountAmount)}`, ledgerY, false, '#10b981');
        ledgerY += 15;
      }
      if (taxAmount > 0) {
        drawLedgerRow('Tax (GST):', formatCurrency(taxAmount), ledgerY);
        ledgerY += 15;
      }

      // Grand Total Highlight Bar
      doc.rect(ledgerLeft, ledgerY, ledgerWidth, 24).fill('#e0f2fe');
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#00668a');
      doc.text('GRAND TOTAL:', ledgerLeft + 10, ledgerY + 6);
      doc.text(formatCurrency(netAmount), ledgerLeft + 10, ledgerY + 6, { width: ledgerWidth - 20, align: 'right' });
      ledgerY += 28;

      drawLedgerRow('Amount Paid:', formatCurrency(paidAmount), ledgerY, true, '#10b981');
      ledgerY += 15;
      const balance = Math.max(0, netAmount - paidAmount);
      drawLedgerRow('Balance Due:', formatCurrency(balance), ledgerY, true, balance > 0 ? '#ba1a1a' : '#475569');

      // Left terms box
      doc.rect(40, y, 280, 80).fill('#f8fafc');
      doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica-Bold')
        .text('TERMS & CONDITIONS', 48, y + 6);
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica')
        .text('1. Goods once sold will be accepted for return or exchange as per store policy.', 48, y + 20, { width: 265 })
        .text('2. Please retain this invoice receipt for warranty or exchange claims.', 48, y + 36, { width: 265 })
        .text('3. This is a computer-generated tax invoice generated by the POS system.', 48, y + 52, { width: 265 });

      // ─── Signatures Footer ───────────────────────────────────────────────────
      const footerY = Math.max(y + 110, ledgerY + 30);
      doc.moveTo(40, footerY + 30).lineTo(180, footerY + 30).stroke('#94a3b8');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#475569')
        .text('Customer Signature', 40, footerY + 35, { width: 140, align: 'center' });

      doc.moveTo(415, footerY + 30).lineTo(555, footerY + 30).stroke('#94a3b8');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#475569')
        .text(`Authorized Signatory\n(${shop.name || 'Store'})`, 415, footerY + 35, { width: 140, align: 'center' });

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
