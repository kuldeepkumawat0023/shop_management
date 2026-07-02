'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, Printer, Download, Share2, CheckCircle2, Building2, Receipt, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentDetailView() {
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
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Payment Voucher</h2>
                <StatusBadge status="Completed" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">Ref: PAY-2026-081 • Jul 24, 2026, 11:30 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button className="flex-1 sm:flex-none gradient-button text-white border-none shadow-md shadow-primary/20 font-semibold gap-2 rounded-xl">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full flex flex-col gap-6">
        
        {/* Receipt Box */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden flex flex-col relative print:shadow-none print:border-none">
          
          {/* Success Header Ribbon */}
          <div className="bg-success/10 border-b border-success/20 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4 relative z-10">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-2xl font-black text-success uppercase tracking-wider relative z-10">Payment Received</h3>
            <p className="text-sm font-bold text-success/80 mt-1 relative z-10">Transaction Successful</p>
          </div>

          <div className="p-6 md:p-10 flex flex-col gap-8">
            
            {/* Amount & Date */}
            <div className="flex flex-col items-center justify-center text-center border-b border-outline-variant/20 pb-8">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Amount</span>
              <span className="text-5xl font-black text-on-surface tracking-tighter">₹15,000</span>
              <span className="text-sm font-medium text-on-surface-variant mt-3">on July 24, 2026 at 11:30 AM</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-outline-variant/20 pb-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary font-bold mb-1">
                  <Building2 className="w-5 h-5" />
                  Party Details
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Received From</span>
                  <span className="font-bold text-on-surface text-lg">Ramesh Singh</span>
                  <span className="text-sm font-medium text-on-surface-variant mt-0.5">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary font-bold mb-1">
                  <CreditCard className="w-5 h-5" />
                  Payment Info
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Method</span>
                  <span className="font-bold text-on-surface text-lg">UPI (Google Pay)</span>
                  <span className="text-sm font-medium text-on-surface-variant mt-0.5 break-all">UTR: 123456789012</span>
                </div>
              </div>
            </div>

            {/* Notes / Remarks */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <Receipt className="w-5 h-5" />
                Notes & Reference
              </div>
              <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
                <p className="text-sm font-medium text-on-surface leading-relaxed">
                  Advance payment received against Order #ORD-2026-105. Remaining balance will be cleared upon delivery.
                </p>
              </div>
            </div>

          </div>
          
          {/* Footer watermark */}
          <div className="bg-surface-container-low/50 py-4 text-center border-t border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant">Generated by Shop Management System • Ref: PAY-2026-081</p>
          </div>
        </div>

      </div>
    </div>
  );
}
