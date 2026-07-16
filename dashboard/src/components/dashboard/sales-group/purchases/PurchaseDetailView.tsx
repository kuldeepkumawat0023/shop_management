'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Printer, Download, ShoppingCart, Truck, CheckCircle2, FileText, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { purchaseService } from '@/lib/services/purchase.services';

export default function PurchaseDetailView() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [purchase, setPurchase] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

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
  if (!purchase) return <div className="p-8">Purchase not found / खरीदारी नहीं मिली</div>;

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
                <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/20">Delivered / वितरित</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mt-0.5">Ordered on / आदेश दिया गया: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Mark Received / प्राप्त किया गया चिह्नित करें</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF / पीडीएफ डाउनलोड करें</span>
            </Button>
            <Button className="flex-1 sm:flex-none gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2 border-none">
              <Printer className="w-4 h-4" />
              Print PO / पीओ प्रिंट करें
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
                <h3 className="text-lg font-bold text-on-surface">Supplier Details / आपूर्तिकर्ता विवरण</h3>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-on-surface">{purchase.supplierId?.name || 'Unknown Supplier / अज्ञात आपूर्तिकर्ता'}</p>
                <p className="text-sm text-on-surface-variant font-medium">{purchase.supplierId?.email || 'No email / कोई ईमेल नहीं'}</p>
                <p className="text-sm text-on-surface-variant font-medium">{purchase.supplierId?.phone || 'No phone / कोई फोन नहीं'}</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface">Order Info / आदेश जानकारी</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <p className="text-on-surface-variant">Expected Delivery / अपेक्षित वितरण</p>
                    <p className="font-bold text-on-surface">Oct 28, 2023</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Payment Terms / भुगतान शर्तें</p>
                    <p className="font-bold text-on-surface">{purchase.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Created By / द्वारा बनाया गया</p>
                    <p className="font-bold text-on-surface">{purchase.userId?.fullname || 'Admin / व्यवस्थापक'}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Delivery Status / वितरण स्थिति</p>
                    <div className="flex items-center gap-1 text-success font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Delivered / वितरित
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant/10 bg-surface/50">
              <h3 className="text-lg font-bold text-on-surface">Purchase Items / खरीद आइटम</h3>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-surface-container border-b border-outline-variant/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Raw Material / Product / कच्चा माल / उत्पाद</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-center">Qty / मात्रा</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Unit Rate / इकाई दर</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Tax (18%) / कर (18%)</th>
                    <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Total / कुल</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <tr className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-on-surface">Total Items / कुल आइटम</p>
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
                <span className="text-on-surface-variant">Subtotal / उप-कुल</span>
                <span className="font-bold text-on-surface">₹{purchase.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Tax Amount / कर राशि</span>
                <span className="font-bold text-on-surface">₹{purchase.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-success">
                <span className="font-medium">Discount Applied / छूट लागू</span>
                <span className="font-bold">-₹{purchase.discountAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center mb-2">
                <span className="font-bold text-on-surface text-lg">Grand Total / कुल योग</span>
                <span className="font-black text-primary text-2xl">₹{purchase.netAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-4 p-3 bg-success/10 text-success rounded-xl border border-success/20">
                <span className="font-bold">Amount Paid / भुगतान की गई राशि</span>
                <span className="font-black">₹{purchase.paidAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
