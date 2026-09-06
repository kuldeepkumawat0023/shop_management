'use client';

import React, { useState } from 'react';
import { X, Printer, Share2, Check, ArrowRight, FileText, Receipt } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

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

  if (!isOpen || !sale) return null;

  const saleData = sale.sale || sale;
  const saleItems = items && items.length > 0 ? items : (sale.items || []);

  const anyUser = user as any;
  const shopName = anyUser?.shopName || 'MY RETAIL STORE';
  const shopAddress = anyUser?.shopAddress || anyUser?.address || '';
  const shopPhone = anyUser?.shopPhone || anyUser?.phoneNumber || '';
  const shopGstin = anyUser?.shopGstin || anyUser?.gstin || '';
  const cashierName = anyUser?.fullname || saleData.userId?.fullname || 'Cashier';
  const customerName = saleData.customerId?.name || 'Walk-in Customer';
  const customerMobile = saleData.customerId?.mobile || saleData.customerId?.phone || '';

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*Invoice Receipt - ${shopName}*\n\n` +
      `*Invoice No:* ${saleData.invoiceNumber}\n` +
      `*Date:* ${new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleDateString()}\n` +
      `*Total Items:* ${saleItems.length}\n` +
      `*Net Amount:* ₹${Number(saleData.netAmount || 0).toFixed(2)}\n` +
      `*Payment Mode:* ${saleData.paymentMethod?.toUpperCase()}\n\n` +
      `Thank you for shopping with us! Visit again.`;

    const cleanNumber = customerMobile.replace(/\D/g, '');
    const url = cleanNumber
      ? `https://wa.me/91${cleanNumber.slice(-10)}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `Invoice: ${saleData.invoiceNumber} | Total: ₹${Number(saleData.netAmount || 0).toFixed(2)} | Date: ${new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleDateString()}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:bg-white print:overflow-visible">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-5 py-3.5 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('pos.invoiceModal.format')}</span>
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="text-success border-success/30 hover:bg-success/10 font-bold gap-1.5 h-8 px-3"
            >
              <Share2 className="w-3.5 h-3.5" />
              {t('pos.invoiceModal.whatsapp')}
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="font-bold gap-1.5 h-8 px-4"
            >
              <Printer className="w-3.5 h-3.5" />
              {t('pos.invoiceModal.print')}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface-container-lowest print:p-0 print:overflow-visible custom-scrollbar">
          
          {format === 'thermal' ? (
            /* THERMAL 80mm RECEIPT */
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
                  <span className="font-bold">{saleData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.dateTime')}</span>
                  <span>{new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.cashier')}</span>
                  <span>{cashierName}</span>
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
                      const price = item.sellingPrice || 0;
                      const total = item.totalPrice || (qty * price);
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
                  <span>₹{Number(saleData.totalAmount || 0).toFixed(2)}</span>
                </div>
                {saleData.discountAmount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>{t('pos.invoiceModal.discount')}</span>
                    <span>-₹{Number(saleData.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                {saleData.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>{t('pos.invoiceModal.tax')}</span>
                    <span>+₹{Number(saleData.taxAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-gray-300">
                  <span>{t('pos.invoiceModal.grandTotal')}</span>
                  <span>₹{Number(saleData.netAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-gray-400">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t('pos.invoiceModal.paymentMode')}</span>
                  <span className="font-bold uppercase">{saleData.paymentMethod || 'CASH'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('pos.invoiceModal.paidAmount')}</span>
                  <span className="font-bold">₹{Number(saleData.paidAmount || saleData.netAmount || 0).toFixed(2)}</span>
                </div>
                {saleData.paidAmount > saleData.netAmount && (
                  <div className="flex justify-between text-gray-700">
                    <span className="text-gray-500">{t('pos.invoiceModal.changeReturned')}</span>
                    <span className="font-bold">₹{(saleData.paidAmount - saleData.netAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t('pos.invoiceModal.status', 'Status:')}</span>
                  <StatusBadge status={saleData.paymentStatus || 'Paid'} variant="dot" />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 text-center text-[10px] text-gray-500 space-y-1">
                <p className="font-bold uppercase text-gray-700">*** {t('pos.invoiceModal.thankYouMessage')} ***</p>
                <p>{t('pos.invoiceModal.visitAgain')}</p>
                <p className="font-mono text-[9px] tracking-widest text-gray-400 pt-1">POWERED BY SHOP SYSTEM</p>
              </div>

            </div>
          ) : (
            /* STANDARD A4 TAX INVOICE */
            <div id="print-area" className="mx-auto max-w-[700px] bg-white text-gray-900 p-8 rounded-xl border border-gray-300 shadow-sm print:shadow-none print:border-none print:p-4 print:max-w-full text-xs">
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{shopName}</h1>
                  <p className="text-gray-500 text-xs mt-1">Retail & Wholesale Distribution</p>
                  {shopAddress && <p className="text-gray-600 mt-0.5">{shopAddress}</p>}
                  {shopPhone && <p className="text-gray-600">{t('pos.invoiceModal.phone')} {shopPhone}</p>}
                  {shopGstin && <p className="text-gray-800 font-bold mt-1">{t('pos.invoiceModal.gstin')} {shopGstin}</p>}
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded font-black text-sm uppercase tracking-wider mb-2">
                    {t('pos.invoiceModal.taxInvoice')}
                  </div>
                  <p className="font-bold text-sm text-gray-900"># {saleData.invoiceNumber}</p>
                  <p className="text-gray-500 mt-0.5">{t('pos.invoiceModal.dateTime')} {new Date(saleData.saleDate || saleData.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <span className="text-gray-500">{t('pos.invoiceModal.paymentMode')}</span>
                    <StatusBadge status={saleData.paymentMethod} />
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="py-4 border-b border-gray-200">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{t('pos.invoiceModal.billedTo')}:</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{customerName}</p>
                {customerMobile && <p className="text-gray-600">{t('pos.invoiceModal.mobile')} {customerMobile}</p>}
              </div>

              {/* Items Table */}
              <div className="py-4">
                <table className="w-full text-left border border-gray-200">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">{t('pos.invoiceModal.item')}</th>
                      <th className="py-2 px-3 text-center">{t('pos.invoiceModal.qty')}</th>
                      <th className="py-2 px-3 text-right">{t('pos.invoiceModal.rate')} (₹)</th>
                      <th className="py-2 px-3 text-right">{t('pos.invoiceModal.amt')} (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {saleItems.map((item: any, idx: number) => {
                      const name = item.name || item.productId?.name || 'Item';
                      const qty = item.quantity || 1;
                      const price = item.sellingPrice || 0;
                      const total = item.totalPrice || (qty * price);
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-gray-800">{name}</td>
                          <td className="py-2 px-3 text-center">{qty}</td>
                          <td className="py-2 px-3 text-right">{price.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-bold text-gray-900">{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('pos.invoiceModal.subtotal')}</span>
                    <span>{formatCurrency(saleData.totalAmount)}</span>
                  </div>
                  {saleData.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>{t('pos.invoiceModal.discount')}</span>
                      <span>-{formatCurrency(saleData.discountAmount)}</span>
                    </div>
                  )}
                  {saleData.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>{t('pos.invoiceModal.tax')}</span>
                      <span>+{formatCurrency(saleData.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-gray-300 text-gray-900">
                    <span>{t('pos.invoiceModal.grandTotal')}</span>
                    <span>{formatCurrency(saleData.netAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 pt-1">
                    <span>{t('pos.invoiceModal.paidAmount')}</span>
                    <span className="font-semibold">{formatCurrency(saleData.paidAmount || saleData.netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Signature & Terms */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
                <div>
                  <p className="font-bold text-gray-700 mb-1">{t('pos.invoiceModal.terms')}:</p>
                  <p>1. {t('pos.invoiceModal.terms1')}</p>
                  <p>2. {t('pos.invoiceModal.terms2')}</p>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-gray-400 pb-8 mb-1"></div>
                  <p className="font-bold text-gray-700">{t('pos.invoiceModal.authorisedSignatory')}</p>
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

      {/* Print Specific CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 10px !important;
              background: white !important;
              color: black !important;
            }
            @page {
              margin: 4mm;
              size: auto;
            }
          }
        `
      }} />
    </div>
  );
}
