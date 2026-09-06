'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Printer, Download, Share2, Loader2, Receipt } from 'lucide-react';
import { printPOSInvoice } from '@/utils/printHelper';
import { generatePdfFromHtml, downloadPdfBlob, sharePdfViaWhatsApp } from '@/utils/pdfShare';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export interface DocumentActionButtonsProps {
  fileName: string;
  getHtml: (format: 'a4' | 'thermal') => string;
  recipientPhone?: string;
  recipientName?: string;
  shareMessage?: string;
  showPrint?: boolean;
  showThermalPrint?: boolean;
  showDownloadPdf?: boolean;
  showWhatsApp?: boolean;
  onCustomDownload?: () => Promise<void>;
  className?: string;
}

export function DocumentActionButtons({
  fileName,
  getHtml,
  recipientPhone,
  recipientName = 'Customer',
  shareMessage,
  showPrint = true,
  showThermalPrint = true,
  showDownloadPdf = true,
  showWhatsApp = true,
  onCustomDownload,
  className
}: DocumentActionButtonsProps) {
  const { t } = useTranslation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState(false);

  const handlePrint = (format: 'a4' | 'thermal') => {
    try {
      const html = getHtml(format);
      printPOSInvoice(html, format);
    } catch (err) {
      console.error('Print error:', err);
      toast.error(t('common.printError', 'Failed to trigger print / प्रिंट करने में विफल'));
    }
  };

  const handleDownloadPdf = async () => {
    if (onCustomDownload) {
      return onCustomDownload();
    }
    try {
      setIsGeneratingPdf(true);
      const html = getHtml('a4');
      const blob = await generatePdfFromHtml(html, fileName);
      if (blob) {
        downloadPdfBlob(blob, `${fileName}.pdf`);
        toast.success(t('common.pdfDownloaded', 'PDF downloaded successfully! / PDF डाउनलोड हो गया!'));
      } else {
        toast.error(t('common.pdfError', 'Failed to generate PDF / PDF जनरेट नहीं हो सका'));
      }
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error(t('common.pdfError', 'Failed to generate PDF / PDF जनरेट नहीं हो सका'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (!recipientPhone) {
      toast.error(t('common.noPhoneProvided', 'Recipient phone number is missing / फ़ोन नंबर उपलब्ध नहीं है'));
      return;
    }

    try {
      setIsSharingWhatsApp(true);
      const html = getHtml('a4');
      const blob = await generatePdfFromHtml(html, fileName);
      const defaultMsg = shareMessage || `Hello ${recipientName}, please find your document: ${fileName}. Thank you!`;

      if (blob) {
        await sharePdfViaWhatsApp(blob, `${fileName}.pdf`, recipientPhone, defaultMsg);
      } else {
        const cleanPhone = recipientPhone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`, '_blank');
      }
    } catch (err) {
      console.error('WhatsApp share error:', err);
      toast.error(t('common.whatsAppError', 'Failed to share via WhatsApp / व्हाट्सएप पर भेजने में विफल'));
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* WhatsApp Share Button */}
      {showWhatsApp && (
        <Button
          type="button"
          onClick={handleWhatsAppShare}
          disabled={isSharingWhatsApp}
          variant="outline"
          className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 gap-2 rounded-xl h-10 px-3.5 shadow-sm transition-all"
        >
          {isSharingWhatsApp ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{t('common.whatsApp', 'WhatsApp')}</span>
        </Button>
      )}

      {/* Download PDF Button */}
      {showDownloadPdf && (
        <Button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          variant="outline"
          className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2 rounded-xl h-10 px-3.5 shadow-sm transition-all"
        >
          {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Download className="w-4 h-4" />}
          <span className="hidden sm:inline">{t('common.downloadPdf', 'Download PDF')}</span>
        </Button>
      )}

      {/* Thermal (80mm) Print Button */}
      {showThermalPrint && (
        <Button
          type="button"
          onClick={() => handlePrint('thermal')}
          variant="outline"
          className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-amber-600 hover:bg-amber-500/10 gap-2 rounded-xl h-10 px-3.5 shadow-sm transition-all"
          title="Print Thermal 80mm continuous slip"
        >
          <Receipt className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">{t('common.thermalPrint', 'Thermal (80mm)')}</span>
        </Button>
      )}

      {/* Standard Print (A4) Button */}
      {showPrint && (
        <Button
          type="button"
          onClick={() => handlePrint('a4')}
          className="flex-1 sm:flex-none gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2 border-none rounded-xl h-10 px-4 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>{t('common.print', 'Print A4')}</span>
        </Button>
      )}
    </div>
  );
}
