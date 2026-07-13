'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Banknote, User, Receipt, ArrowDownLeft, ArrowUpRight, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { paymentSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function PaymentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    paymentType: 'Money In',
    partyId: '',
    amount: '',
    paymentMethod: 'UPI',
    date: '',
    referenceNo: '',
    notes: '',
    status: 'Completed'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTypeToggle = (type: 'Money In' | 'Money Out') => {
    setFormData(prev => ({ ...prev, paymentType: type }));
  };

  const handleClear = () => {
    setFormData({
      paymentType: 'Money In',
      partyId: '',
      amount: '',
      paymentMethod: 'UPI',
      date: '',
      referenceNo: '',
      notes: '',
      status: 'Completed'
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      amount: Number(formData.amount) || 0
    };

    const validationResult = paymentSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें', { id: 'please-correct-the-errors-----' });
    }

    setSubmitting(true);
    const toastId = toast.loading('Saving payment...');
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payment saved successfully!', { id: toastId });
      router.back();
    } catch (err: any) {
      toast.error('Failed to save payment', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full ">
      {/* Header Sticky */}
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Record Payment</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Log an incoming receipt or outgoing expense.</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
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
                  formData.paymentType === 'Money In' 
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
                  formData.paymentType === 'Money Out' 
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
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Amount (₹) <span className="text-error ml-1">*</span></label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="e.g. 5000"
                  className={cn(
                    "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.amount ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.amount && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.amount}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Date <span className="text-error ml-1">*</span></label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all",
                      errors.date ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                  {errors.date && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.date}</p>}
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Payment Method <span className="text-error ml-1">*</span></label>
                  <select 
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className={cn(
                      "flex w-full h-10 rounded-xl bg-surface border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none",
                      errors.paymentMethod ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                  {errors.paymentMethod && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.paymentMethod}</p>}
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
                  {formData.paymentType === 'Money In' ? 'Received From (Customer)' : 'Paid To (Supplier/Vendor)'} <span className="text-error ml-1">*</span>
                </label>
                <input 
                  type="text"
                  name="partyId"
                  value={formData.partyId}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Singh"
                  className={cn(
                    "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.partyId ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.partyId && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.partyId}</p>}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Reference & Notes</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Reference ID / UTR No</label>
                <input
                  type="text"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleInputChange}
                  placeholder="e.g. UPI Ref / Cheque No."
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Clear Form
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">{submitting ? 'Saving...' : 'Save Payment'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
