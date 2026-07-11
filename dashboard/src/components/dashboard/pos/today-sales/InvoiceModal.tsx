'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
  items: any[];
}

export default function InvoiceModal({ isOpen, onClose, sale, items }: InvoiceModalProps) {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer print:hidden"
        onClick={onClose}
      />

      {/* Modal / Printable Area */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none overflow-hidden print:overflow-visible">
        
        {/* Header - Hidden on print */}
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container shrink-0 print:hidden">
          <h2 className="text-xl font-bold text-on-surface">Invoice Details</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary/20 transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 overflow-y-auto print:overflow-visible print:p-0" id="print-section">
          {/* Invoice Header */}
          <div className="text-center mb-8 border-b border-dashed border-outline-variant/30 pb-6">
            <h1 className="text-2xl font-black text-on-surface uppercase tracking-wider mb-1">Retail Invoice</h1>
            <p className="text-sm text-on-surface-variant font-medium">Smart Shop Management</p>
          </div>

          <div className="flex justify-between items-start mb-8 text-sm">
            <div>
              <p className="text-on-surface-variant mb-1">Invoice To:</p>
              <p className="font-bold text-on-surface text-base">{sale.customerId?.name || 'Walk-in Customer'}</p>
              {sale.customerId?.mobile && <p className="text-on-surface-variant mt-1">{sale.customerId.mobile}</p>}
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant mb-1">Invoice Details:</p>
              <p className="font-bold text-on-surface"><span className="text-on-surface-variant/70 font-normal">No:</span> {sale.invoiceNumber}</p>
              <p className="font-bold text-on-surface mt-1"><span className="text-on-surface-variant/70 font-normal">Date:</span> {new Date(sale.saleDate).toLocaleDateString()}</p>
              <p className="font-bold text-on-surface mt-1"><span className="text-on-surface-variant/70 font-normal">Method:</span> {sale.paymentMethod}</p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-outline-variant/20 rounded-xl overflow-hidden print:border-black print:rounded-none">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-low text-on-surface uppercase font-bold text-xs print:bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 print:divide-black">
                {items.map((item, index) => (
                  <tr key={index} className="text-on-surface font-medium">
                    <td className="px-4 py-3">{item.productId?.name || 'Unknown Product'}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.sellingPrice)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 w-full max-w-sm ml-auto space-y-2 text-sm">
            <div className="flex justify-between text-on-surface-variant font-medium px-4">
              <span>Subtotal</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="flex justify-between text-error font-medium px-4">
                <span>Discount</span>
                <span>-{formatCurrency(sale.discountAmount)}</span>
              </div>
            )}
            {sale.taxAmount > 0 && (
              <div className="flex justify-between text-on-surface-variant font-medium px-4">
                <span>Tax</span>
                <span>+{formatCurrency(sale.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface font-black text-lg p-4 bg-surface-container-lowest rounded-xl mt-4 print:bg-gray-100 print:rounded-none">
              <span>Grand Total</span>
              <span>{formatCurrency(sale.netAmount)}</span>
            </div>
            
            {/* Payment Info */}
            <div className="mt-6 pt-4 border-t border-dashed border-outline-variant/30 text-center text-xs text-on-surface-variant">
              <p>Amount Paid: <span className="font-bold text-on-surface">{formatCurrency(sale.paidAmount)}</span></p>
              <p className="mt-1">Status: <span className={cn('font-bold', sale.paymentStatus === 'Paid' ? 'text-success' : 'text-error')}>{sale.paymentStatus}</span></p>
            </div>
          </div>
          
          <div className="text-center mt-12 text-xs text-on-surface-variant/50 print:mt-20">
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />
    </div>
  );
}
