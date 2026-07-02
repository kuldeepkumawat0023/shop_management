'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, Printer, Download, ShoppingCart, Truck, CheckCircle2, FileText, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PurchaseDetailView() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">PO-2023-001</h2>
                <StatusBadge status="Paid" />
                <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/20">Delivered</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mt-0.5">Ordered on Oct 24, 2023</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Mark Received</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
            <Button className="flex-1 sm:flex-none gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2 border-none">
              <Printer className="w-4 h-4" />
              Print PO
            </Button>
          </div>
        </div>
      </div>

      {/* Purchase Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-5xl mx-auto w-full flex flex-col gap-6">
        
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <Truck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Supplier Details</h3>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-on-surface">TechParts Pvt Ltd</p>
              <p className="text-sm text-on-surface-variant font-medium">sales@techparts.com</p>
              <p className="text-sm text-on-surface-variant font-medium">+91 98765 11223</p>
              <div className="mt-2 text-sm text-on-surface-variant">
                45 Industrial Estate, Sector 5<br />
                Manufacturing Hub, Metro City<br />
                State, 654321
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Order Info</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <p className="text-on-surface-variant">Expected Delivery</p>
                  <p className="font-bold text-on-surface">Oct 28, 2023</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Payment Terms</p>
                  <p className="font-bold text-on-surface">Net 30</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Created By</p>
                  <p className="font-bold text-on-surface">Admin User</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Delivery Status</p>
                  <div className="flex items-center gap-1 text-success font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Delivered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/10 bg-surface/50">
            <h3 className="text-lg font-bold text-on-surface">Purchase Items</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-surface-container border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Raw Material / Product</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-center">Qty</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Unit Rate</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Tax (18%)</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">Aluminium Sheets 5mm</p>
                    <p className="text-xs text-on-surface-variant">SKU: RM-ALU-05</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-on-surface-variant">250</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹400.00</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹72.00</td>
                  <td className="px-6 py-4 text-right font-bold text-on-surface">₹118,000.00</td>
                </tr>
                <tr className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">Industrial Glue Gallon</p>
                    <p className="text-xs text-on-surface-variant">SKU: RM-GLU-GL</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-on-surface-variant">10</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹2,000.00</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹360.00</td>
                  <td className="px-6 py-4 text-right font-bold text-on-surface">₹23,600.00</td>
                </tr>
                <tr className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">Freight / Shipping</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-on-surface-variant">1</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹3,400.00</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">-</td>
                  <td className="px-6 py-4 text-right font-bold text-on-surface">₹3,400.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="flex flex-col md:flex-row justify-end">
          <div className="w-full md:w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-bold text-on-surface">₹123,400.00</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-on-surface-variant">Tax Amount</span>
              <span className="font-bold text-on-surface">₹21,600.00</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm text-success">
              <span className="font-medium">Discount Applied</span>
              <span className="font-bold">-₹0.00</span>
            </div>
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center mb-2">
              <span className="font-bold text-on-surface text-lg">Grand Total</span>
              <span className="font-black text-primary text-2xl">₹145,000.00</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-4 p-3 bg-success/10 text-success rounded-xl border border-success/20">
              <span className="font-bold">Amount Paid</span>
              <span className="font-black">₹145,000.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
