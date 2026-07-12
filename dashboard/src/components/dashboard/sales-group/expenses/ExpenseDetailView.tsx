'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, Printer, Download, Share2, Receipt, Building2, Calendar, CreditCard, Tag, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExpenseDetailView() {
  const router = useRouter();

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
                <h2 className="text-2xl font-black text-on-surface tracking-tight">EXP-101</h2>
                <StatusBadge status="Paid" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">Logged on Jul 24, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold gap-2 rounded-xl">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold gap-2 rounded-xl">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-8">
        
        {/* Main Details Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden">
          {/* Amount Highlights */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/20">
            <div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Amount</p>
              <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">₹8,500.00</h1>
            </div>
            <div className="flex gap-4">
              <div className="bg-surface rounded-2xl p-4 border border-outline-variant/20 min-w-[120px]">
                <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Payee</span>
                </div>
                <p className="font-bold text-on-surface line-clamp-1">Reliance Power</p>
              </div>
              <div className="bg-surface rounded-2xl p-4 border border-outline-variant/20 min-w-[120px]">
                <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Category</span>
                </div>
                <p className="font-bold text-on-surface line-clamp-1">Utilities</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Expense Details
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">Description</p>
                  <p className="text-on-surface font-semibold mt-1 leading-relaxed">Monthly electricity bill for the main warehouse and office space. Due date was Jul 25, paid early.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Info
              </h3>
              <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Payment Method</span>
                  <span className="font-bold text-on-surface">Bank Transfer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Payment Date</span>
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-on-surface-variant" />
                    Jul 24, 2026
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                  <span className="text-sm font-medium text-on-surface-variant">Transaction Ref</span>
                  <span className="font-mono text-sm font-bold text-on-surface">TRX-9988221</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attachment Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 p-6 md:p-8 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Receipts & Attachments
          </h3>
          <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-on-surface-variant" />
            </div>
            <p className="text-on-surface font-bold">reliance_bill_jul.pdf</p>
            <p className="text-sm text-on-surface-variant mt-1 mb-4">1.2 MB</p>
            <Button variant="outline" className="gap-2 font-bold rounded-xl border-outline-variant/30">
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
          </div>
        </div>

        {/* Delete Zone */}
        <div className="flex justify-end pt-4">
          <Button variant="ghost" className="text-error hover:bg-error/10 font-bold gap-2 rounded-xl">
            <Trash2 className="w-4 h-4" />
            Delete Expense
          </Button>
        </div>

      </div>
    </div>
  );
}
