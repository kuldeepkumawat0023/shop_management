'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Truck, CheckCircle2, FileText, Calendar, Building2, Phone, Mail, Hash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { purchaseService } from '@/lib/services/purchase.services';
import { shopService, ShopData } from '@/lib/services/shop.services';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formatCurrency';
import { getPurchaseOrderPdfHtml } from '@/utils/pdfTemplates';
import { DocumentActionButtons } from '@/components/common/DocumentActionButtons';
import toast from 'react-hot-toast';

export default function PurchaseDetailView() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [purchase, setPurchase] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShop, setActiveShop] = useState<ShopData | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const [purRes, shopRes] = await Promise.all([
          purchaseService.getPurchaseById(id),
          shopService.getMyShop()
        ]);
        if (purRes.success && purRes.data) {
          const purchaseObj = purRes.data.purchase || purRes.data;
          const itemsList = purRes.data.items || purchaseObj.items || [];
          setPurchase(purchaseObj);
          setItems(itemsList);
        }
        if (shopRes.success && shopRes.data) {
          setActiveShop(shopRes.data);
        }
      } catch (e) {
        console.error('Failed to load purchase details:', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPurchase();
  }, [id]);

  if (loading) return <DetailViewSkeleton />;
  if (!purchase) return <div className="p-8 text-on-surface font-semibold">{t('purchases.purchaseDetail.purchaseNotFound')}</div>;

  const totalAmount = Number(purchase.totalAmount || 0);
  const discountAmount = Number(purchase.discountAmount || 0);
  const taxAmount = Number(purchase.taxAmount || 0);
  const netAmount = Number(purchase.netAmount || totalAmount - discountAmount + taxAmount);
  const paidAmount = Number(purchase.paidAmount || 0);
  const balanceDue = Math.max(0, netAmount - paidAmount);

  const getHtml = (fmt: 'a4' | 'thermal' = 'a4') => {
    return getPurchaseOrderPdfHtml({
      purchase,
      items,
      shop: activeShop || undefined,
      format: fmt
    });
  };

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background w-full min-w-0">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight font-mono">
                  {purchase.invoiceNumber}
                </h2>
                <StatusBadge status={purchase.paymentStatus || 'Paid'} />
              </div>
              <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                {t('purchases.purchaseDetail.orderedOn')}: {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
          <DocumentActionButtons
            fileName={`Purchase-${purchase.invoiceNumber || id}`}
            getHtml={getHtml}
            recipientPhone={purchase?.supplierId?.mobile || purchase?.supplierId?.phone}
            recipientName={purchase?.supplierId?.name || 'Vendor'}
            shareMessage={`Hello ${purchase?.supplierId?.name || 'Vendor'}, here is Purchase Order #${purchase.invoiceNumber} for ₹${netAmount.toLocaleString()} from ${activeShop?.name || 'our shop'}. Thank you!`}
          />
        </div>
      </div>

      {/* Purchase Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                <Truck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">
                  {t('purchases.purchaseDetail.supplierDetails')}
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-on-surface">
                  {purchase.supplierId?.name || t('purchases.purchaseDetail.unknownSupplier')}
                </p>
                {purchase.supplierId?.contactPerson && (
                  <p className="text-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary" />
                    Contact: {purchase.supplierId.contactPerson}
                  </p>
                )}
                {purchase.supplierId?.mobile && (
                  <p className="text-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary" />
                    {purchase.supplierId.mobile}
                  </p>
                )}
                {purchase.supplierId?.email && (
                  <p className="text-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" />
                    {purchase.supplierId.email}
                  </p>
                )}
                {purchase.supplierId?.gstNumber && (
                  <p className="text-xs text-on-surface-variant font-mono mt-1">
                    GSTIN: {purchase.supplierId.gstNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">
                  {t('purchases.purchaseDetail.orderInfo')}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                    {t('purchases.purchaseDetail.expectedDelivery', 'Order Date')}
                  </p>
                  <p className="font-bold text-on-surface mt-0.5">
                    {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                    {t('purchases.purchaseDetail.paymentTerms', 'Payment Method')}
                  </p>
                  <p className="font-bold text-on-surface mt-0.5">
                    {purchase.paymentMethod || 'Cash'}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                    {t('purchases.purchaseDetail.createdBy', 'Recorded By')}
                  </p>
                  <p className="font-bold text-on-surface mt-0.5">
                    {purchase.userId?.fullname || t('purchases.purchaseDetail.admin', 'Admin')}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                    Payment Status
                  </p>
                  <div className="mt-0.5">
                    <StatusBadge status={purchase.paymentStatus || 'Paid'} />
                  </div>
                </div>
              </div>
            </div>
            {purchase.notes && (
              <div className="mt-4 pt-3 border-t border-outline-variant/10">
                <p className="text-xs text-on-surface-variant font-semibold">Notes:</p>
                <p className="text-sm text-on-surface italic mt-0.5">{purchase.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/10 bg-surface/50">
            <h3 className="text-lg font-bold text-on-surface">
              {t('purchases.purchaseDetail.purchaseItems')} ({items.length})
            </h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-surface-container border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">
                    {t('purchases.purchaseDetail.rawMaterialProduct')}
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-center">
                    {t('purchases.purchaseDetail.qty')}
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">
                    {t('purchases.purchaseDetail.unitRate')}
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">
                    GST %
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">
                    {t('purchases.purchaseDetail.total')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {items && items.length > 0 ? (
                  items.map((item: any, idx: number) => {
                    const name = item.productId?.name || item.name || `Item #${idx + 1}`;
                    const sku = item.productId?.sku;
                    const qty = item.quantity || 0;
                    const rate = item.purchasePrice || 0;
                    const gst = item.gstRate ? `${item.gstRate}%` : '0%';
                    const lineTotal = item.totalPrice || qty * rate;

                    return (
                      <tr key={item._id || idx} className="hover:bg-surface/40 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{name}</p>
                          {sku && (
                            <p className="text-xs text-on-surface-variant font-mono">SKU: {sku}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-on-surface">
                          {qty} {item.productId?.unit || ''}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-on-surface font-mono">
                          {formatCurrency(rate)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-on-surface-variant">
                          {gst}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-on-surface font-mono">
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-on-surface">
                        {t('purchases.purchaseDetail.totalItems')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-on-surface-variant">-</td>
                    <td className="px-6 py-4 text-right font-medium text-on-surface-variant">-</td>
                    <td className="px-6 py-4 text-right font-medium text-on-surface-variant">-</td>
                    <td className="px-6 py-4 text-right font-bold text-on-surface font-mono">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="flex flex-col md:flex-row justify-end">
          <div className="w-full md:w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-on-surface-variant">{t('purchases.purchaseDetail.subtotal')}</span>
              <span className="font-bold text-on-surface font-mono">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-on-surface-variant">{t('purchases.purchaseDetail.taxAmount')}</span>
              <span className="font-bold text-on-surface font-mono">{formatCurrency(taxAmount)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-4 text-sm text-success">
                <span className="font-medium">{t('purchases.purchaseDetail.discountApplied')}</span>
                <span className="font-bold font-mono">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center mb-2">
              <span className="font-bold text-on-surface text-lg">{t('purchases.purchaseDetail.grandTotal')}</span>
              <span className="font-black text-primary text-2xl font-mono">{formatCurrency(netAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-4 p-3 bg-success/10 text-success rounded-xl border border-success/20">
              <span className="font-bold">{t('purchases.purchaseDetail.amountPaid')}</span>
              <span className="font-black font-mono">{formatCurrency(paidAmount)}</span>
            </div>
            {balanceDue > 0 && (
              <div className="flex justify-between items-center text-sm mt-2 p-3 bg-error/10 text-error rounded-xl border border-error/20">
                <span className="font-bold">Balance Due:</span>
                <span className="font-black font-mono">{formatCurrency(balanceDue)}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
