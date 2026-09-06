'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Share2, Check, ArrowRight, FileText, Receipt, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { shopService, ShopData } from '@/lib/services/shop.services';
import { generatePdfFromHtml, downloadPdfBlob, sharePdfViaWhatsApp } from '@/utils/pdfShare';
import { getPOSInvoicePdfHtml } from '@/utils/pdfTemplates';
import { printPOSInvoice } from '@/utils/printHelper';
import toast from 'react-hot-toast';

interface POSInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
  items?: any[];
  onNewSale?: () => void;
}

export default function POSInvoiceModal({
  isOpen,
  onClose,
  sale,
  items = [],
  onNewSale
}: POSInvoiceModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [format, setFormat] = useState<'thermal' | 'a4'>('thermal');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState(false);
  const [activeShop, setActiveShop] = useState<ShopData | null>(null);

  const saleData = sale?.sale || sale;
  const saleItems = items && items.length > 0 ? items : (sale?.items || saleData?.items || []);

  // Fetch or retrieve active shop details dynamically
  useEffect(() => {
    if (!isOpen) return;

    // Check if shopId on sale is already populated
    if (saleData?.shopId && typeof saleData.shopId === 'object' && saleData.shopId.name) {
      setActiveShop(saleData.shopId as ShopData);
      return;
    }

    // Otherwise fetch current shop data from store service
    const fetchCurrentShop = async () => {
      try {
        const res = await shopService.getMyShop();
        if (res.success && res.data) {
          setActiveShop(res.data);
        }
      } catch (err) {
        console.error('Failed to load shop profile in invoice:', err);
      }
    };

    fetchCurrentShop();
  }, [isOpen, saleData?.shopId]);

  if (!isOpen || !sale) return null;

  const anyUser = user as any;
  const shopName = activeShop?.name || anyUser?.shopName || 'MY RETAIL STORE';
  const shopAddress = activeShop?.address || anyUser?.shopAddress || anyUser?.address || '';
  const shopPhone = activeShop?.contactNumber || anyUser?.shopPhone || anyUser?.phoneNumber || '';
  const shopGstin = activeShop?.gstNumber || anyUser?.shopGstin || anyUser?.gstin || '';
  const shopEmail = activeShop?.email || anyUser?.email || '';

  const cashierName = saleData?.userId?.fullname || anyUser?.fullname || 'Cashier';
  const customerName = saleData?.customerId?.name || 'Walk-in Customer';
  const customerMobile = saleData?.customerId?.mobile || saleData?.customerId?.phone || '';

  const invoiceNumber = saleData?.invoiceNumber || 'INV-001';
  const totalAmount = Number(saleData?.totalAmount || 0);
  const discountAmount = Number(saleData?.discountAmount || 0);
  const taxAmount = Number(saleData?.taxAmount || 0);
  const netAmount = Number(saleData?.netAmount || 0);
  const paidAmount = Number(saleData?.paidAmount || saleData?.netAmount || 0);
  const balanceDue = Math.max(0, netAmount - paidAmount);
  const paymentMethod = (saleData?.paymentMethod || 'Cash').toUpperCase();

  const handlePrint = () => {
    printPOSInvoice(getCompiledHtml(), format);
  };

  // Helper to compile HTML for PDF / sharing
  const getCompiledHtml = () => {
    return getPOSInvoicePdfHtml({
      sale: saleData,
      items: saleItems,
      shop: {
        name: shopName,
        address: shopAddress,
        contactNumber: shopPhone,
        email: shopEmail,
        gstNumber: shopGstin
      },
      cashierName,
      format
    });
  };

  // Generate & Download PDF
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const toastId = toast.loading(t('pos.invoiceModal.generatingPdf', 'Generating PDF...'));
    try {
      const html = getCompiledHtml();
      const filename = `Invoice-${invoiceNumber}-${format}`;
      const blob = await generatePdfFromHtml(html, filename, { isThermal: format === 'thermal' });

      if (blob) {
        downloadPdfBlob(blob, filename);
        toast.success(t('pos.invoiceModal.pdfDownloaded', 'PDF Downloaded!'), { id: toastId });
      } else {
        toast.error('Failed to generate PDF', { id: toastId });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // WhatsApp Share with PDF Attachment + Message
  const handleWhatsAppShare = async () => {
    setIsSharingWhatsApp(true);
    const toastId = toast.loading('Preparing WhatsApp share...');
    try {
      const text = `*Invoice Receipt - ${shopName}*\n\n` +
        `*Invoice No:* ${invoiceNumber}\n` +
        `*Date:* ${new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleDateString('en-IN')}\n` +
        `*Billed By:* ${cashierName}\n` +
        `*Total Items:* ${saleItems.length}\n` +
        `*Net Total:* ₹${netAmount.toFixed(2)}\n` +
        `*Payment Mode:* ${paymentMethod}\n\n` +
        `Thank you for shopping with ${shopName}! Visit again.`;

      const html = getCompiledHtml();
      const filename = `Invoice-${invoiceNumber}`;
      const blob = await generatePdfFromHtml(html, filename, { isThermal: format === 'thermal' });

      toast.dismiss(toastId);

      if (blob) {
        await sharePdfViaWhatsApp(blob, filename, customerMobile, text);
      } else {
        // Fallback text URL
        const cleanNumber = customerMobile.replace(/\D/g, '');
        const url = cleanNumber
          ? `https://wa.me/91${cleanNumber.slice(-10)}?text=${encodeURIComponent(text)}`
          : `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast.error('Failed to share via WhatsApp', { id: toastId });
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `Invoice: ${invoiceNumber} | Store: ${shopName} | Total: ₹${netAmount.toFixed(2)} | Cashier: ${cashierName}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm print:static print:inset-auto print:block print:p-0 print:m-0 print:bg-white print:backdrop-blur-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden print:static print:max-w-full print:max-h-none print:w-full print:border-none print:shadow-none print:bg-white print:overflow-visible print:m-0 print:p-0">
        
        {/* Pinned Top-Right Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2.5 right-3 h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl z-30 print:hidden cursor-pointer"
          title={t('common.close', 'Close')}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Top Control Bar (Hidden when printing) */}
        <div className="pl-5 pr-14 py-3 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-2.5 bg-surface-container-low shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t('pos.invoiceModal.format')}
            </span>
            <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/20">
              <Button
                variant={format === 'thermal' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFormat('thermal')}
                className={cn(
                  "gap-1.5 h-7 px-3 text-xs font-bold",
                  format !== 'thermal' && "text-on-surface-variant"
                )}
              >
                <Receipt className="w-3.5 h-3.5" />
                {t('pos.invoiceModal.thermal')}
              </Button>
              <Button
                variant={format === 'a4' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFormat('a4')}
                className={cn(
                  "gap-1.5 h-7 px-3 text-xs font-bold",
                  format !== 'a4' && "text-on-surface-variant"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                {t('pos.invoiceModal.a4')}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="text-primary border-primary/30 hover:bg-primary/10 font-bold gap-1.5 h-8 px-3"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{t('pos.invoiceModal.downloadPdf', 'Download PDF')}</span>
            </Button>

            {/* WhatsApp Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              disabled={isSharingWhatsApp}
              className="text-success border-success/30 hover:bg-success/10 font-bold gap-1.5 h-8 px-3"
            >
              {isSharingWhatsApp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{t('pos.invoiceModal.whatsapp')}</span>
            </Button>

            {/* Print Button */}
            <Button
              size="sm"
              onClick={handlePrint}
              className="font-bold gap-1.5 h-8 px-4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('pos.invoiceModal.print')}</span>
            </Button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface-container-lowest print:p-0 print:m-0 print:overflow-visible print:bg-white custom-scrollbar">
          
          {format === 'thermal' ? (
            /* ─────────────────────────────────────────────────────────────
               THERMAL 80mm RECEIPT
               ───────────────────────────────────────────────────────────── */
            <div id="print-area" className="mx-auto max-w-[360px] bg-white text-black p-5 rounded-lg border border-dashed border-gray-300 shadow-sm print:shadow-none print:border-none print:p-2 print:max-w-full font-mono text-xs">
              
              {/* Header */}
              <div className="text-center pb-3 border-b border-dashed border-gray-400">
                <h2 className="text-base font-black uppercase tracking-wider">{shopName}</h2>
                <p className="text-[11px] text-gray-600 mt-0.5">{t('pos.invoiceModal.retailReceipt')}</p>
                {shopAddress && <p className="text-[10px] text-gray-500 mt-0.5">{shopAddress}</p>}
                {shopPhone && <p className="text-[10px] text-gray-500">{t('pos.invoiceModal.phone')} {shopPhone}</p>}
                {shopGstin && <p className="text-[10px] font-bold text-gray-700">{t('pos.invoiceModal.gstin')} {shopGstin}</p>}
              </div>

              {/* Bill Details */}
              <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-gray-400">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.invoice')}</span>
                  <span className="font-bold">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.dateTime')}</span>
                  <span>{new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.billedBy', 'Billed By:')}</span>
                  <span className="font-bold text-gray-900">{cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.customer')}</span>
                  <span className="font-semibold">{customerName}</span>
                </div>
                {customerMobile && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('pos.invoiceModal.mobile')}</span>
                    <span>{customerMobile}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="py-2.5 border-b border-dashed border-gray-400">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-300 text-[10px] font-bold uppercase text-gray-600">
                      <th className="py-1">{t('pos.invoiceModal.item')}</th>
                      <th className="py-1 text-center">{t('pos.invoiceModal.qty')}</th>
                      <th className="py-1 text-right">{t('pos.invoiceModal.rate')}</th>
                      <th className="py-1 text-right">{t('pos.invoiceModal.amt')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11px]">
                    {saleItems.map((item: any, idx: number) => {
                      const name = item.name || item.productId?.name || 'Item';
                      const qty = item.quantity || 1;
                      const price = Number(item.sellingPrice || item.price || 0);
                      const total = Number(item.totalPrice || (qty * price));
                      return (
                        <tr key={idx}>
                          <td className="py-1 pr-1 font-medium">{name}</td>
                          <td className="py-1 text-center">{qty}</td>
                          <td className="py-1 text-right">{price.toFixed(2)}</td>
                          <td className="py-1 text-right font-bold">{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="py-2.5 space-y-1.5 text-[11px] border-b border-dashed border-gray-400">
                <div className="flex justify-between">
                  <span>{t('pos.invoiceModal.subtotal')}</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t('pos.invoiceModal.discount')}</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>{t('pos.invoiceModal.tax')}</span>
                    <span>+₹{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-gray-300">
                  <span>{t('pos.invoiceModal.grandTotal')}</span>
                  <span>₹{netAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-gray-400">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t('pos.invoiceModal.paymentMode')}</span>
                  <span className="font-bold uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.paidAmount')}</span>
                  <span className="font-bold">₹{paidAmount.toFixed(2)}</span>
                </div>
                {balanceDue > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Balance Due:</span>
                    <span>₹{balanceDue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500">{t('pos.invoiceModal.status', 'Status:')}</span>
                  <StatusBadge status={saleData.paymentStatus || 'Paid'} variant="dot" />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 text-center text-[10px] text-gray-500 space-y-1">
                <p className="font-bold uppercase text-gray-700">*** {t('pos.invoiceModal.thankYouMessage')} ***</p>
                <p>{t('pos.invoiceModal.visitAgain')}</p>
                <p className="font-mono text-[9px] tracking-widest text-gray-400 pt-1">POWERED BY SMART SHOP POS</p>
              </div>

            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               STANDARD A4 TAX INVOICE (With Project Theme Accents)
               ───────────────────────────────────────────────────────────── */
            <div id="print-area" className="mx-auto max-w-[720px] bg-white text-gray-900 p-8 rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:p-4 print:max-w-full text-xs">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-primary">
                <div>
                  <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">{shopName}</h1>
                  <p className="text-gray-500 text-xs mt-1">Official Retail & Sales Point</p>
                  {shopAddress && <p className="text-gray-600 mt-0.5">{shopAddress}</p>}
                  {shopPhone && <p className="text-gray-600">{t('pos.invoiceModal.phone')} {shopPhone}</p>}
                  {shopGstin && <p className="text-gray-800 font-bold mt-1">{t('pos.invoiceModal.gstin')} {shopGstin}</p>}
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md font-black text-sm uppercase tracking-wider mb-2">
                    {t('pos.invoiceModal.taxInvoice')}
                  </div>
                  <p className="font-mono font-bold text-sm text-gray-900"># {invoiceNumber}</p>
                  <p className="text-gray-500 mt-0.5">{t('pos.invoiceModal.dateTime')} {new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <span className="text-gray-500">{t('pos.invoiceModal.paymentMode')}</span>
                    <span className="font-bold text-gray-900">{paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Client & Biller Grid */}
              <div className="py-4 border-b border-gray-200 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{t('pos.invoiceModal.billedTo')}:</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{customerName}</p>
                  {customerMobile && <p className="text-gray-600">{t('pos.invoiceModal.mobile')} {customerMobile}</p>}
                </div>

                <div className="bg-sky-50/60 p-3 rounded-lg border border-sky-100">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-sky-700">{t('pos.invoiceModal.billedBy', 'Billed By:')}</p>
                  <p className="text-sm font-black text-secondary mt-0.5">{cashierName}</p>
                  <p className="text-gray-600 text-[11px] mt-0.5">Counter POS Operator</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-4">
                <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 text-white text-[10px] font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">{t('pos.invoiceModal.item')}</th>
                      <th className="py-2.5 px-3 text-center">{t('pos.invoiceModal.qty')}</th>
                      <th className="py-2.5 px-3 text-right">{t('pos.invoiceModal.rate')} (₹)</th>
                      <th className="py-2.5 px-3 text-right">{t('pos.invoiceModal.amt')} (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {saleItems.map((item: any, idx: number) => {
                      const name = item.name || item.productId?.name || 'Item';
                      const qty = item.quantity || 1;
                      const price = Number(item.sellingPrice || item.price || 0);
                      const total = Number(item.totalPrice || (qty * price));
                      return (
                        <tr key={idx} className={cn("hover:bg-gray-50", idx % 2 === 1 && "bg-gray-50/50")}>
                          <td className="py-2.5 px-3 text-gray-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-800">{name}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-gray-900">{qty}</td>
                          <td className="py-2.5 px-3 text-right text-gray-700">{price.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-gray-900">{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('pos.invoiceModal.subtotal')}</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>{t('pos.invoiceModal.discount')}</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  {taxAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>{t('pos.invoiceModal.tax')}</span>
                      <span>+{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black pt-2 border-t border-gray-300 text-secondary">
                    <span>{t('pos.invoiceModal.grandTotal')}</span>
                    <span>{formatCurrency(netAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 pt-1 font-semibold">
                    <span>{t('pos.invoiceModal.paidAmount')} ({paymentMethod}):</span>
                    <span>{formatCurrency(paidAmount)}</span>
                  </div>
                  {balanceDue > 0 && (
                    <div className="flex justify-between text-xs text-red-600 pt-1 font-bold">
                      <span>Balance Due:</span>
                      <span>{formatCurrency(balanceDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Signature & Terms */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
                <div className="max-w-xs">
                  <p className="font-bold text-gray-700 mb-1">{t('pos.invoiceModal.terms')}:</p>
                  <p>1. {t('pos.invoiceModal.terms1')}</p>
                  <p>2. {t('pos.invoiceModal.terms2')}</p>
                </div>
                <div className="text-center">
                  <div className="w-40 border-b border-gray-400 pb-8 mb-1"></div>
                  <p className="font-bold text-gray-700">{t('pos.invoiceModal.authorisedSignatory')}</p>
                  <p className="text-[10px] text-primary font-bold">{shopName}</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions (Hidden when printing) */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between gap-3 shrink-0 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs text-on-surface-variant gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : null}
            {copied ? t('pos.invoiceModal.copied') : t('pos.invoiceModal.copyInfo')}
          </Button>

          <div className="flex items-center gap-2">
            {onNewSale && (
              <Button
                onClick={() => {
                  onClose();
                  onNewSale();
                }}
                className="font-bold gap-2 px-5 shadow-lg shadow-primary/20"
              >
                <span>{t('pos.invoiceModal.newSale')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="border-outline-variant/30 text-on-surface"
            >
              {t('common.close', 'Close')}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
