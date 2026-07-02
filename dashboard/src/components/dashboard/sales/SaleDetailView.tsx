'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, Printer, Download, Share2, Receipt, User, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SaleDetailView() {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/sales">
              <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">INV-2023-001</h2>
                <StatusBadge status="Paid" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant mt-0.5">Oct 24, 2023 at 10:45 AM</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30 text-on-surface-variant hover:text-primary gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
            <Button className="flex-1 sm:flex-none gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2 border-none">
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-5xl mx-auto w-full flex flex-col gap-6">
        
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Customer Details</h3>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-on-surface">Acme Corp</p>
              <p className="text-sm text-on-surface-variant font-medium">contact@acmecorp.com</p>
              <p className="text-sm text-on-surface-variant font-medium">+91 98765 43210</p>
              <div className="mt-2 text-sm text-on-surface-variant">
                123 Business Park, Phase 2<br />
                Industrial Area, Tech City<br />
                State, 123456
              </div>
            </div>
          </div>

          {/* Order Summary Info */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
                <Receipt className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Order Info</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <p className="text-on-surface-variant">Payment Method</p>
                  <p className="font-bold text-on-surface">Credit Card (Ends 4242)</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Sales Channel</p>
                  <p className="font-bold text-on-surface">In-Store POS</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Cashier/Sales Rep</p>
                  <p className="font-bold text-on-surface">Rahul Sharma</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Fulfillment</p>
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
            <h3 className="text-lg font-bold text-on-surface">Order Items</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-surface-container border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Item Description</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-center">Qty</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Rate</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Tax (18%)</th>
                  <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">Premium Acoustic Foam</p>
                    <p className="text-xs text-on-surface-variant">SKU: PAF-001</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-on-surface-variant">100</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹300.00</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹54.00</td>
                  <td className="px-6 py-4 text-right font-bold text-on-surface">₹35,400.00</td>
                </tr>
                <tr className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">Standard Desk Legs</p>
                    <p className="text-xs text-on-surface-variant">SKU: SDL-002</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-on-surface-variant">20</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹400.00</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹72.00</td>
                  <td className="px-6 py-4 text-right font-bold text-on-surface">₹9,440.00</td>
                </tr>
                <tr className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">Shipping & Handling</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-on-surface-variant">1</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">₹160.00</td>
                  <td className="px-6 py-4 text-right font-medium text-on-surface-variant">-</td>
                  <td className="px-6 py-4 text-right font-bold text-on-surface">₹160.00</td>
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
              <span className="font-bold text-on-surface">₹38,160.00</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-on-surface-variant">Tax (CGST + SGST)</span>
              <span className="font-bold text-on-surface">₹6,840.00</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm text-success">
              <span className="font-medium">Discount (Bulk Order)</span>
              <span className="font-bold">-₹0.00</span>
            </div>
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center mb-2">
              <span className="font-bold text-on-surface text-lg">Grand Total</span>
              <span className="font-black text-primary text-2xl">₹45,000.00</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-4 p-3 bg-success/10 text-success rounded-xl border border-success/20">
              <span className="font-bold">Amount Paid</span>
              <span className="font-black">₹45,000.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
