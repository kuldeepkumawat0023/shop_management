/**
 * 🧾 PDF HTML Template Generator for POS Invoices & Receipts
 * Uses Project Theme Colors from globals.css:
 * Primary: #0ea5e9 (Sky Blue), Secondary: #00668a (Deep Blue), Slate: #0f172a
 */

export interface POSInvoicePdfData {
  sale: any;
  items: any[];
  shop?: {
    name?: string;
    address?: string;
    contactNumber?: string;
    email?: string;
    gstNumber?: string;
    logo?: string;
  };
  cashierName?: string;
  format?: 'a4' | 'thermal';
}

export const getPOSInvoicePdfHtml = ({
  sale,
  items = [],
  shop = {},
  cashierName = 'Cashier',
  format = 'a4'
}: POSInvoicePdfData): string => {
  const saleData = sale?.sale || sale || {};
  const saleItems = items && items.length > 0 ? items : (sale?.items || saleData?.items || []);

  const shopName = shop?.name || 'MY RETAIL STORE';
  const shopAddress = shop?.address || 'Retail Store Address';
  const shopPhone = shop?.contactNumber || '—';
  const shopEmail = shop?.email || '';
  const shopGstin = shop?.gstNumber || '';

  const customerName = saleData?.customerId?.name || 'Walk-in Customer';
  const customerMobile = saleData?.customerId?.mobile || saleData?.customerId?.phone || '—';
  const customerAddress = saleData?.customerId?.address || '';

  const invoiceNumber = saleData?.invoiceNumber || 'INV-001';
  const saleDate = new Date(saleData?.saleDate || saleData?.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const saleTime = new Date(saleData?.saleDate || saleData?.createdAt || Date.now()).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalAmount = Number(saleData?.totalAmount || 0);
  const discountAmount = Number(saleData?.discountAmount || 0);
  const taxAmount = Number(saleData?.taxAmount || 0);
  const netAmount = Number(saleData?.netAmount || 0);
  const paidAmount = Number(saleData?.paidAmount || 0);
  const balanceDue = Math.max(0, netAmount - paidAmount);
  const paymentMethod = (saleData?.paymentMethod || 'Cash').toUpperCase();
  const paymentStatus = (saleData?.paymentStatus || 'Paid').toUpperCase();

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. A4 Format Template
  // ─────────────────────────────────────────────────────────────────────────────
  if (format === 'a4') {
    const tableRows = saleItems.map((item: any, idx: number) => {
      const p = item.productId || item.item || {};
      const name = p.name || item.name || 'Item';
      const sku = p.sku || item.sku || '—';
      const qty = item.quantity || 1;
      const unit = p.unit || item.unit || 'pcs';
      const price = Number(item.sellingPrice || item.price || 0);
      const gst = item.gstRate || 0;
      const rowTotal = Number(item.totalPrice || (qty * price));

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
          <td style="padding: 8px 10px; text-align: center; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 8px 12px;">
            <div style="font-weight: 700; color: #0f172a; font-size: 12px;">${name}</div>
            ${sku !== '—' ? `<div style="font-size: 10px; color: #64748b; font-family: monospace;">SKU: ${sku}</div>` : ''}
          </td>
          <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #0f172a; font-size: 11.5px;">${qty} ${unit}</td>
          <td style="padding: 8px 10px; text-align: right; color: #334155; font-size: 11.5px;">₹${price.toFixed(2)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b; font-size: 11px;">${gst}%</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0f172a; font-size: 12px;">₹${rowTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="pdf-container" style="width: 794px; background: #ffffff; padding: 24px 28px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.4;">
        
        <!-- Header Band with Project Primary / Sky Blue accents -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #00668a; padding-bottom: 14px; margin-bottom: 16px;">
          <div>
            <h1 style="margin: 0 0 4px 0; font-size: 22px; font-weight: 900; color: #00668a; letter-spacing: -0.5px; text-transform: uppercase;">
              ${shopName}
            </h1>
            <div style="font-size: 11px; color: #334155; margin-bottom: 2px;">${shopAddress}</div>
            <div style="font-size: 11px; color: #475569;">Phone: <strong>${shopPhone}</strong> ${shopEmail ? `| Email: ${shopEmail}` : ''}</div>
            ${shopGstin ? `<div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 2px;">GSTIN: ${shopGstin}</div>` : ''}
          </div>

          <div style="text-align: right;">
            <div style="font-size: 20px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.5px; margin: 0;">TAX INVOICE</div>
            <div style="font-size: 13px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 3px;"># ${invoiceNumber}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Date: <strong>${saleDate}</strong>, ${saleTime}</div>
          </div>
        </div>

        <!-- Info Grid -->
        <div style="display: flex; gap: 14px; margin-bottom: 16px;">
          <!-- Customer Box -->
          <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
            <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #00668a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 6px;">
              CUSTOMER DETAILS
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${customerName}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">Mobile: ${customerMobile}</div>
            ${customerAddress ? `<div style="font-size: 10.5px; color: #475569; margin-top: 2px;">Address: ${customerAddress}</div>` : ''}
          </div>

          <!-- Biller / Cashier Box -->
          <div style="flex: 1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 10px 14px;">
            <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1.5px solid #bae6fd; padding-bottom: 3px; margin-bottom: 6px;">
              BILLING & OPERATOR INFO
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0f172a;">Billed By: <span style="color: #0369a1;">${cashierName}</span></div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">Payment Mode: <strong>${paymentMethod}</strong></div>
            <div style="font-size: 11px; color: ${paymentStatus === 'PAID' ? '#10b981' : '#f59e0b'}; font-weight: 800; margin-top: 2px;">Payment Status: ${paymentStatus}</div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th style="width: 35px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: center;">#</th>
              <th style="padding: 8px 12px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: left;">Item Details</th>
              <th style="width: 80px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: center;">Qty</th>
              <th style="width: 85px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: right;">Price</th>
              <th style="width: 65px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: center;">GST</th>
              <th style="width: 95px; padding: 8px 12px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || `<tr><td colspan="6" style="padding: 16px; text-align: center; color: #94a3b8;">No items</td></tr>`}
          </tbody>
        </table>

        <!-- Financial Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
          <!-- Left Terms & Conditions -->
          <div style="flex: 1.2; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
            <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 6px;">
              TERMS & CONDITIONS
            </div>
            <ol style="margin: 0; padding-left: 14px; font-size: 9.5px; color: #475569; line-height: 1.5;">
              <li>Goods once sold can be returned or exchanged within 7 days with original invoice.</li>
              <li>Warranty is subject to original manufacturer guidelines and terms.</li>
              <li>This is a computer-generated tax invoice generated by the official POS counter.</li>
            </ol>
            <div style="margin-top: 10px; font-size: 10px; font-weight: 700; color: #0284c7;">
              Thank you for shopping with ${shopName}! Visit again.
            </div>
          </div>

          <!-- Right Ledger Box -->
          <div style="width: 280px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
            <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #334155; border-bottom: 1px solid #f1f5f9;">
              <span>Items Total:</span>
              <span>₹${totalAmount.toFixed(2)}</span>
            </div>
            ${discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #10b981; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                <span>Discount:</span>
                <span>- ₹${discountAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            ${taxAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #334155; border-bottom: 1px solid #f1f5f9;">
                <span>GST Tax:</span>
                <span>₹${taxAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 9px 12px; font-size: 14px; font-weight: 900; color: #00668a; background: #e0f2fe; border-top: 1.5px solid #0ea5e9;">
              <span>NET TOTAL:</span>
              <span>₹${netAmount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #10b981; font-weight: 700; border-top: 1px solid #e2e8f0;">
              <span>Amount Paid (${paymentMethod}):</span>
              <span>₹${paidAmount.toFixed(2)}</span>
            </div>
            ${balanceDue > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11.5px; color: #ba1a1a; font-weight: 800; background: #fff5f5;">
                <span>Balance Due:</span>
                <span>₹${balanceDue.toFixed(2)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Signature Block -->
        <div style="display: flex; justify-content: space-between; margin-top: 36px; padding-top: 12px;">
          <div style="width: 180px; text-align: center; border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10.5px; font-weight: 700; color: #475569;">
            Customer Signature
          </div>
          <div style="width: 220px; text-align: center; border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10.5px; font-weight: 700; color: #475569;">
            Authorized Signatory<br><span style="color: #00668a;">(${shopName})</span>
          </div>
        </div>

      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. 80mm Thermal Format Template
  // ─────────────────────────────────────────────────────────────────────────────
  const thermalItems = saleItems.map((item: any) => {
    const p = item.productId || item.item || {};
    const name = p.name || item.name || 'Item';
    const qty = item.quantity || 1;
    const price = Number(item.sellingPrice || item.price || 0);
    const rowTotal = Number(item.totalPrice || (qty * price));

    return `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11.5px;">
        <div style="flex: 1; padding-right: 6px;">
          <div style="font-weight: 700; color: #000000;">${name}</div>
          <div style="font-size: 10px; color: #555555;">${qty} x ₹${price.toFixed(2)}</div>
        </div>
        <div style="font-weight: 800; text-align: right; color: #000000;">₹${rowTotal.toFixed(2)}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="pdf-container" style="width: 360px; background: #ffffff; padding: 16px 14px; box-sizing: border-box; font-family: 'Courier New', Courier, monospace; color: #000000; font-size: 11.5px; line-height: 1.3;">
      
      <!-- Store Header -->
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">${shopName}</div>
        <div style="font-size: 10.5px; margin-top: 2px;">${shopAddress}</div>
        <div style="font-size: 10px; margin-top: 1px;">Phone: ${shopPhone}</div>
        ${shopGstin ? `<div style="font-size: 10px; font-weight: bold; margin-top: 1px;">GSTIN: ${shopGstin}</div>` : ''}
      </div>

      <div style="border-top: 1px dashed #000000; margin: 8px 0;"></div>

      <!-- Invoice Info -->
      <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 2px;">
        <span>Inv: <strong>${invoiceNumber}</strong></span>
        <span>${saleDate} ${saleTime}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 2px;">
        <span>Cust: ${customerName}</span>
        <span>Ph: ${customerMobile}</span>
      </div>
      <div style="font-size: 10.5px; font-weight: bold; margin-bottom: 4px;">
        Billed By: ${cashierName}
      </div>

      <div style="border-top: 1px dashed #000000; margin: 8px 0;"></div>

      <!-- Items List -->
      <div style="margin: 8px 0;">
        ${thermalItems}
      </div>

      <div style="border-top: 1px dashed #000000; margin: 8px 0;"></div>

      <!-- Financial Totals -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
        <span>Subtotal:</span>
        <span>₹${totalAmount.toFixed(2)}</span>
      </div>
      ${discountAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Discount:</span>
          <span>- ₹${discountAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      ${taxAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>GST Tax:</span>
          <span>₹${taxAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 900; border-top: 1px solid #000000; padding-top: 4px; margin-top: 4px;">
        <span>NET TOTAL:</span>
        <span>₹${netAmount.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 3px;">
        <span>Paid via ${paymentMethod}:</span>
        <span>₹${paidAmount.toFixed(2)}</span>
      </div>
      ${balanceDue > 0 ? `
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-top: 2px;">
          <span>Due Balance:</span>
          <span>₹${balanceDue.toFixed(2)}</span>
        </div>
      ` : ''}

      <div style="border-top: 1px dashed #000000; margin: 10px 0;"></div>

      <!-- Footer Message -->
      <div style="text-align: center; font-size: 10px;">
        <div>Thank you for your visit!</div>
        <div style="margin-top: 2px;">Computer Generated Receipt</div>
      </div>

    </div>
  `;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Purchase Order / Supplier Bill PDF Template
// ─────────────────────────────────────────────────────────────────────────────

export interface PurchaseOrderPdfData {
  purchase: any;
  items?: any[];
  shop?: {
    name?: string;
    address?: string;
    contactNumber?: string;
    email?: string;
    gstNumber?: string;
    logo?: string;
  };
  format?: 'a4' | 'thermal';
}

export const getPurchaseOrderPdfHtml = ({
  purchase,
  items = [],
  shop = {},
  format = 'a4'
}: PurchaseOrderPdfData): string => {
  const purData = purchase?.purchase || purchase || {};
  const purItems = items && items.length > 0 ? items : (purchase?.items || purData?.items || []);

  const shopName = shop?.name || 'MY RETAIL STORE';
  const shopAddress = shop?.address || 'Store Address';
  const shopPhone = shop?.contactNumber || '—';
  const shopEmail = shop?.email || '';
  const shopGstin = shop?.gstNumber || '';

  const sup = purData?.supplierId || {};
  const supplierName = typeof sup === 'object' ? (sup.name || 'Vendor / Supplier') : 'Vendor / Supplier';
  const supplierContact = typeof sup === 'object' ? (sup.contactPerson || '') : '';
  const supplierMobile = typeof sup === 'object' ? (sup.mobile || sup.phone || '—') : '—';
  const supplierAddress = typeof sup === 'object' ? (sup.address || '') : '';
  const supplierGstin = typeof sup === 'object' ? (sup.gstNumber || sup.gstin || '') : '';

  const poNumber = purData?.invoiceNumber || purData?.poNumber || 'PO-001';
  const poDate = new Date(purData?.purchaseDate || purData?.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const totalAmount = Number(purData?.totalAmount || 0);
  const discountAmount = Number(purData?.discountAmount || 0);
  const taxAmount = Number(purData?.taxAmount || 0);
  const netAmount = Number(purData?.netAmount || (totalAmount - discountAmount + taxAmount));
  const paidAmount = Number(purData?.paidAmount || 0);
  const balanceDue = Math.max(0, netAmount - paidAmount);
  const paymentMethod = (purData?.paymentMethod || 'Cash').toUpperCase();
  const paymentStatus = (purData?.paymentStatus || (balanceDue === 0 ? 'Paid' : 'Pending')).toUpperCase();

  if (format === 'a4') {
    const tableRows = purItems.map((item: any, idx: number) => {
      const p = item.productId || {};
      const name = p.name || item.product || item.name || 'Item';
      const sku = p.sku || item.sku || '—';
      const qty = item.quantity || 1;
      const unit = p.unit || item.unit || 'pcs';
      const price = Number(item.purchasePrice || item.unitPrice || item.price || 0);
      const gst = item.gstRate || item.tax || 0;
      const rowTotal = Number(item.totalPrice || (qty * price));

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
          <td style="padding: 8px 10px; text-align: center; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 8px 12px;">
            <div style="font-weight: 700; color: #0f172a; font-size: 12px;">${name}</div>
            ${sku !== '—' ? `<div style="font-size: 10px; color: #64748b; font-family: monospace;">SKU: ${sku}</div>` : ''}
          </td>
          <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #0f172a; font-size: 11.5px;">${qty} ${unit}</td>
          <td style="padding: 8px 10px; text-align: right; color: #334155; font-size: 11.5px;">₹${price.toFixed(2)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b; font-size: 11px;">${gst}%</td>
          <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #0f172a; font-size: 12px;">₹${rowTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="pdf-container" style="width: 794px; background: #ffffff; padding: 24px 28px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.4;">
        
        <!-- Header Band -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #00668a; padding-bottom: 14px; margin-bottom: 16px;">
          <div>
            <h1 style="margin: 0 0 4px 0; font-size: 22px; font-weight: 900; color: #00668a; letter-spacing: -0.5px; text-transform: uppercase;">
              ${shopName}
            </h1>
            <div style="font-size: 11px; color: #334155; margin-bottom: 2px;">${shopAddress}</div>
            <div style="font-size: 11px; color: #475569;">Phone: <strong>${shopPhone}</strong> ${shopEmail ? `| Email: ${shopEmail}` : ''}</div>
            ${shopGstin ? `<div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 2px;">GSTIN: ${shopGstin}</div>` : ''}
          </div>

          <div style="text-align: right;">
            <div style="font-size: 20px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.5px; margin: 0;">PURCHASE ORDER</div>
            <div style="font-size: 13px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 3px;"># ${poNumber}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Date: <strong>${poDate}</strong></div>
          </div>
        </div>

        <!-- Info Grid -->
        <div style="display: flex; gap: 14px; margin-bottom: 16px;">
          <!-- Supplier Box -->
          <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
            <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #00668a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 6px;">
              SUPPLIER / VENDOR DETAILS
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${supplierName} ${supplierContact ? `(${supplierContact})` : ''}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">Mobile: ${supplierMobile}</div>
            ${supplierGstin ? `<div style="font-size: 11px; color: #475569; margin-top: 2px;">GSTIN: <strong>${supplierGstin}</strong></div>` : ''}
            ${supplierAddress ? `<div style="font-size: 10.5px; color: #475569; margin-top: 2px;">Address: ${supplierAddress}</div>` : ''}
          </div>

          <!-- Order Status Box -->
          <div style="flex: 1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 10px 14px;">
            <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1.5px solid #bae6fd; padding-bottom: 3px; margin-bottom: 6px;">
              ORDER & PAYMENT STATUS
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0f172a;">Order No: <span style="font-family: monospace; color: #0369a1;">${poNumber}</span></div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">Payment Mode: <strong>${paymentMethod}</strong></div>
            <div style="font-size: 11px; color: ${paymentStatus === 'PAID' ? '#10b981' : '#f59e0b'}; font-weight: 800; margin-top: 2px;">Payment Status: ${paymentStatus}</div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th style="width: 35px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: center;">#</th>
              <th style="padding: 8px 12px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: left;">Item Details / Material</th>
              <th style="width: 80px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: center;">Qty</th>
              <th style="width: 85px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: right;">Rate (₹)</th>
              <th style="width: 65px; padding: 8px 10px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: center;">GST</th>
              <th style="width: 95px; padding: 8px 12px; font-size: 9.5px; font-weight: 800; text-transform: uppercase; text-align: right;">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || `<tr><td colspan="6" style="padding: 16px; text-align: center; color: #94a3b8;">No items in order</td></tr>`}
          </tbody>
        </table>

        <!-- Financial Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
          <!-- Left Notes -->
          <div style="flex: 1.2; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
            <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 6px;">
              PURCHASE TERMS & NOTES
            </div>
            <div style="font-size: 10px; color: #475569; line-height: 1.5;">
              ${purData.notes || 'Goods received in proper condition and verified against invoice.'}
            </div>
          </div>

          <!-- Right Ledger Box -->
          <div style="width: 280px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
            <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #334155; border-bottom: 1px solid #f1f5f9;">
              <span>Subtotal:</span>
              <span>₹${totalAmount.toFixed(2)}</span>
            </div>
            ${discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #10b981; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                <span>Discount:</span>
                <span>- ₹${discountAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            ${taxAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #334155; border-bottom: 1px solid #f1f5f9;">
                <span>Tax (GST):</span>
                <span>₹${taxAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 9px 12px; font-size: 14px; font-weight: 900; color: #00668a; background: #e0f2fe; border-top: 1.5px solid #0ea5e9;">
              <span>NET TOTAL:</span>
              <span>₹${netAmount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11px; color: #10b981; font-weight: 700; border-top: 1px solid #e2e8f0;">
              <span>Paid Amount (${paymentMethod}):</span>
              <span>₹${paidAmount.toFixed(2)}</span>
            </div>
            ${balanceDue > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 12px; font-size: 11.5px; color: #ba1a1a; font-weight: 800; background: #fff5f5;">
                <span>Balance Due:</span>
                <span>₹${balanceDue.toFixed(2)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Signature Block -->
        <div style="display: flex; justify-content: space-between; margin-top: 36px; padding-top: 12px;">
          <div style="width: 180px; text-align: center; border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10.5px; font-weight: 700; color: #475569;">
            Supplier / Vendor Signature
          </div>
          <div style="width: 220px; text-align: center; border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10.5px; font-weight: 700; color: #475569;">
            Authorized Receiver<br><span style="color: #00668a;">(${shopName})</span>
          </div>
        </div>

      </div>
    `;
  }

  // Thermal format
  return `
    <div class="pdf-container" style="width: 360px; background: #ffffff; padding: 16px 14px; box-sizing: border-box; font-family: 'Courier New', Courier, monospace; color: #000000; font-size: 11.5px; line-height: 1.3;">
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="font-size: 16px; font-weight: 900; text-transform: uppercase;">${shopName}</div>
        <div style="font-size: 10px; margin-top: 2px;">PURCHASE VOUCHER</div>
        <div style="font-size: 10.5px; margin-top: 2px;">PO #${poNumber} • ${poDate}</div>
        <div style="font-size: 10px; margin-top: 1px;">Supplier: ${supplierName} (${supplierMobile})</div>
      </div>
      <div style="border-top: 1px dashed #000000; margin: 8px 0;"></div>
      <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 13px; margin: 8px 0;">
        <span>TOTAL AMOUNT:</span>
        <span>₹${netAmount.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px;">
        <span>Paid (${paymentMethod}):</span>
        <span>₹${paidAmount.toFixed(2)}</span>
      </div>
      ${balanceDue > 0 ? `
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-top: 2px;">
          <span>Due Balance:</span>
          <span>₹${balanceDue.toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="border-top: 1px dashed #000000; margin: 10px 0;"></div>
      <div style="text-align: center; font-size: 10px;">Verified Stock Inward Voucher</div>
    </div>
  `;
};

