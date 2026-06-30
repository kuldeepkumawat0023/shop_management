const ExcelJS = require('exceljs');
const { formatShortDate } = require('../utils/formatHelpers');

/**
 * Export generic array of objects to Excel
 */
const exportToExcel = async (data, columns, sheetName = 'Data', res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns;

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Style Header
  worksheet.getRow(1).font = { bold: true };

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${sheetName.replace(/\s+/g, '_')}_${Date.now()}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
};

/**
 * Generate GSTR-1 Format (Sales)
 */
const generateGSTR1 = async (salesData, res) => {
  const columns = [
    { header: 'GSTIN/UIN of Recipient', key: 'gstin', width: 20 },
    { header: 'Receiver Name', key: 'customerName', width: 25 },
    { header: 'Invoice Number', key: 'invoiceNumber', width: 15 },
    { header: 'Invoice date', key: 'date', width: 15 },
    { header: 'Invoice Value', key: 'totalAmount', width: 15 },
    { header: 'Rate', key: 'gstRate', width: 10 },
    { header: 'Taxable Value', key: 'taxableAmount', width: 15 },
  ];
  
  // Format data for GSTR1
  const formattedData = salesData.map(sale => ({
    gstin: sale.customerId?.gstNumber || 'URD', // Unregistered Dealer if blank
    customerName: sale.customerId?.name || 'Cash Sales',
    invoiceNumber: sale.invoiceNumber,
    date: formatShortDate(sale.saleDate),
    totalAmount: sale.netAmount,
    gstRate: 'Mixed', // Simplified for generic view
    taxableAmount: sale.netAmount - sale.taxAmount
  }));

  await exportToExcel(formattedData, columns, 'GSTR_1_Sales', res);
};

module.exports = {
  exportToExcel,
  generateGSTR1
};
