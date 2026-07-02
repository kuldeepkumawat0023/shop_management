'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Banknote, User, Receipt, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'Money In',
    party: '',
    amount: '',
    method: 'UPI',
    date: '',
    reference: '',
    notes: '',
    status: 'Completed'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeToggle = (type: 'Money In' | 'Money Out') => {
    setFormData(prev => ({ ...prev, type }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Record Payment</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Log an incoming receipt or outgoing expense.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Save Payment</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Core Details */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            
            {/* Type Toggle */}
            <div className="flex bg-surface-container p-1 rounded-xl w-full border border-outline-variant/20">
              <button
                type="button"
                onClick={() => handleTypeToggle('Money In')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  formData.type === 'Money In' 
                  ? 'bg-surface-container-lowest text-success shadow-sm border border-outline-variant/20' 
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Money In (Receive)
              </button>
              <button
                type="button"
                onClick={() => handleTypeToggle('Money Out')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  formData.type === 'Money Out' 
                  ? 'bg-surface-container-lowest text-error shadow-sm border border-outline-variant/20' 
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Money Out (Pay)
              </button>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20 mt-2">
              <Banknote className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Payment Amount</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g. 5000"
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Payment Method</label>
                  <select 
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                    required
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Party & Tracking */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Party Details</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {formData.type === 'Money In' ? 'Received From (Customer)' : 'Paid To (Supplier/Vendor)'}
                </label>
                <input 
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Singh"
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Reference & Notes</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <Input
                label="Reference ID / UTR No"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="e.g. UPI Ref / Cheque No."
              />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Internal Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
                  placeholder="Add any additional details here..."
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full mt-2">
                <label className="text-sm font-bold text-on-surface">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Completed">Completed (Cleared)</option>
                  <option value="Pending">Pending (Processing)</option>
                  <option value="Failed">Failed / Bounced</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
