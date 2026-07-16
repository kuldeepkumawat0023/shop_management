'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Printer, Download, ShoppingCart, Truck, CheckCircle2, FileText, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { purchaseService } from '@/lib/services/purchase.services';
import { useTranslation } from 'react-i18next';

export default function PurchaseDetailView() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [purchase, setPurchase] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await purchaseService.getPurchaseById(id);
        if (res.success) setPurchase(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPurchase();
  }, [id]);

  if (loading) return <DetailViewSkeleton />;
  if (!purchase) return <div className="p-8">{t('purchases.purchaseDetail.purchaseNotFound')}</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full ">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">{purchase.invoiceNumber}</h2>
                <StatusBadge status={purchase.paymentStatus} />
                <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/20">{t('purchases.purchaseDetail.delivered')}</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mt-0.5">{t('purchases.purchaseDetail.orderedOn')}: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('purchases.purchaseDetail.markReceived')}</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('purchases.purchaseDetail.downloadPdf')}</span>
            </Button>
            <Button className="flex-1 sm:flex-none gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2 border-none">
              <Printer className="w-4 h-4" />
              {t('purchases.purchaseDetail.printPo')}
            </Button>
          </div>
        </div>
      </div>

      {/* Purchase Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <Truck className="w-5 h-5 text-primary" />
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                <Truck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">{t('purchases.purchaseDetail.supplierDetails')}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-on-surface">{purchase.supplierId?.name || t('purchases.purchaseDetail.unknownSupplier')}</p>
                <p className="text-sm text-on-surface-variant font-medium">{purchase.supplierId?.email || t('purchases.purchaseDetail.noEmail')}</p>
                <p className="text-sm text-on-surface-variant font-medium">{purchase.supplierId?.phone || t('purchases.purchaseDetail.noPhone')}</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface">{t('purchases.purchaseDetail.orderInfo')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <p className="text-on-surface-variant">{t('purchases.purchaseDetail.expectedDelivery')}</p>
                    <p className="font-bold text-on-surface">Oct 28, 2023</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">{t('purchases.purchaseDetail.paymentTerms')}</p>
                    <p className="font-bold text-on-surface">{purchase.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">{t('purchases.purchaseDetail.createdBy')}</p>
                    <p className="font-bold text-on-surface">{purchase.userId?.fullname || t('purchases.purchaseDetail.admin')}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">{t('purchases.purchaseDetail.deliveryStatus')}</p>
                    <div className="flex items-center gap-1 text-success font-bold">
                      <CheckCircle2 className="w-4 h-4" /> {t('purchases.purchaseDetail.delivered')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant/10 bg-surface/50">
              <h3 className="text-lg font-bold text-on-surface">{t('purchases.purchaseDetail.purchaseItems')}</h3>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-surface-container border-b border-outline-variant/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">{t('purchases.purchaseDetail.rawMaterialProduct')}</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-center">{t('purchases.purchaseDetail.qty')}</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">{t('purchases.purchaseDetail.unitRate')}</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">{t('purchases.purchaseDetail.tax18')}</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">{t('purchases.purchaseDetail.total')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <tr className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-on-surface">{t('purchases.purchaseDetail.totalItems')}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-on-surface-variant">-</td>
                    <td className="px-6 py-4 text-right font-medium text-on-surface-variant">-</td>
                    <td className="px-6 py-4 text-right font-medium text-on-surface-variant">-</td>
                    <td className="px-6 py-4 text-right font-bold text-on-surface">₹{purchase.totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="flex flex-col md:flex-row justify-end">
            <div className="w-full md:w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">{t('purchases.purchaseDetail.subtotal')}</span>
                <span className="font-bold text-on-surface">₹{purchase.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">{t('purchases.purchaseDetail.taxAmount')}</span>
                <span className="font-bold text-on-surface">₹{purchase.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-success">
                <span className="font-medium">{t('purchases.purchaseDetail.discountApplied')}</span>
                <span className="font-bold">-₹{purchase.discountAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center mb-2">
                <span className="font-bold text-on-surface text-lg">{t('purchases.purchaseDetail.grandTotal')}</span>
                <span className="font-black text-primary text-2xl">₹{purchase.netAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-4 p-3 bg-success/10 text-success rounded-xl border border-success/20">
                <span className="font-bold">{t('purchases.purchaseDetail.amountPaid')}</span>
                <span className="font-black">₹{purchase.paidAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
