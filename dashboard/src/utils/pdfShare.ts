'use client';

/**
 * 📄 PDF Generation and WhatsApp Sharing Utilities
 */

export const generatePdfFromHtml = async (
  htmlContent: string,
  filename: string,
  options?: { isThermal?: boolean }
): Promise<Blob | null> => {
  if (typeof window === 'undefined') return null;

  try {
    // Dynamic import to avoid SSR issues
    // @ts-ignore
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const isThermal = options?.isThermal || false;
    const containerWidth = isThermal ? '380px' : '794px';

    // Create an off-screen container to guarantee dimensions for html2canvas
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'fixed';
    container.style.top = '0px';
    container.style.left = '-99999px';
    container.style.width = containerWidth;
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.zIndex = '-99999';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    // Wait briefly for layout and styles to calculate
    await new Promise((resolve) => setTimeout(resolve, 120));

    const targetElement = (container.querySelector('.pdf-container') as HTMLElement) || container;

    const opt = {
      margin: 0,
      filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: isThermal
        ? { unit: 'mm' as const, format: [80, 240] as [number, number], orientation: 'portrait' as const }
        : { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const pdfBlob = await html2pdf().set(opt).from(targetElement).outputPdf('blob');

    // Cleanup container safely
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }

    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};

export const downloadPdfBlob = (pdfBlob: Blob, filename: string) => {
  if (typeof window === 'undefined') return;
  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const sharePdfViaWhatsApp = async (
  pdfBlob: Blob,
  filename: string,
  phone: string,
  text: string
): Promise<boolean> => {
  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const file = new File([pdfBlob], cleanFilename, { type: 'application/pdf' });

  // 1. Try Web Share API (native on mobile devices like Android Chrome & iOS Safari)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: cleanFilename,
        text: text
      });
      return true;
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.warn('Web Share API failed, falling back:', error);
      } else {
        return false; // User cancelled share modal
      }
    }
  }

  // 2. Fallback for Desktop & Unsupported Browsers:
  // Auto-download the PDF locally, then open WhatsApp with pre-filled message
  downloadPdfBlob(pdfBlob, cleanFilename);

  let cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  if (cleanPhone && !cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(waUrl, '_blank');
  return true;
};
