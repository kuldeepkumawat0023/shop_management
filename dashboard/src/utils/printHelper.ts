/**
 * 🖨️ POS Invoice & Receipt Direct Print Helper
 * Uses an off-screen iframe to guarantee 100% isolated printing:
 * - Eliminates modal vertical-centering and scrollbar offsets
 * - Content starts at the exact top (top: 0, margin: 0)
 * - Supports Thermal 80mm continuous roll and standard A4 Tax Invoice
 */

export const printPOSInvoice = (htmlContent: string, format: 'thermal' | 'a4' = 'a4') => {
  if (typeof window === 'undefined') return;

  // Remove any previous print iframes
  const existingIframe = document.getElementById('pos-print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'pos-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-99999';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  const isThermal = format === 'thermal';

  const printStyles = `
    <style>
      @page {
        size: ${isThermal ? '80mm auto' : 'A4 portrait'};
        margin: ${isThermal ? '0mm' : '8mm'};
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      body {
        display: flex;
        flex-direction: column;
        align-items: ${isThermal ? 'center' : 'stretch'};
        justify-content: flex-start;
        min-height: 0 !important;
      }
      .print-container {
        width: 100%;
        max-width: ${isThermal ? '320px' : '100%'};
        margin: 0 ${isThermal ? 'auto' : '0'} !important;
        padding: ${isThermal ? '4px 6px' : '0'} !important;
      }
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
        .no-print {
          display: none !important;
        }
      }
    </style>
  `;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Print Invoice</title>
        ${printStyles}
      </head>
      <body>
        <div class="print-container">
          ${htmlContent}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Give resources and layout brief time to stabilize, then trigger print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Error invoking print on iframe:', e);
      // Fallback
      window.print();
    } finally {
      // Clean up after print dialog finishes or dismisses
      setTimeout(() => {
        iframe.remove();
      }, 2000);
    }
  }, 250);
};
