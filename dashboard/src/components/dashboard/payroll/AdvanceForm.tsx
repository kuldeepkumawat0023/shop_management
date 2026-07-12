'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Banknote, CalendarClock, MessageSquareText, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { advanceSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function AdvanceForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    date: '', // mapped from dateRequested to match schema
    repaymentTerm: 'Next Salary',
    emiAmount: '',
    status: 'Approved',
    reason: ''
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

  const handleClear = () => {
    setFormData({
      employeeId: '',
      amount: '',
      date: '',
      repaymentTerm: 'Next Salary',
      emiAmount: '',
      status: 'Approved',
      reason: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      amount: Number(formData.amount) || 0,
      emiAmount: Number(formData.emiAmount) || 0
    };

    const validationResult = advanceSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setSubmitting(true);
    const toastId = toast.loading('Saving advance request...');

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Advance request saved successfully!', { id: toastId });
      router.back();
    } catch (err: any) {
      toast.error('Failed to save request', { id: toastId });
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
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Grant Salary Advance</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Record a new advance payment for an employee</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Advance Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                <Banknote className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Advance Details</h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Employee <span className="text-error ml-1">*</span></label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className={cn(
                      "flex w-full h-10 rounded-xl bg-surface border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none",
                      errors.employeeId ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  >
                    <option value="">Select employee...</option>
                    <option value="EMP-001">Ravi Verma (Store Manager)</option>
                    <option value="EMP-002">Anjali Sharma (Sales Exec)</option>
                    <option value="EMP-003">Suresh Kumar (Warehouse)</option>
                    <option value="EMP-004">Megha Gupta (Cashier)</option>
                  </select>
                  {errors.employeeId && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.employeeId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Advance Amount (₹) <span className="text-error ml-1">*</span></label>
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
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Date Requested <span className="text-error ml-1">*</span></label>
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
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                <MessageSquareText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Reason & Status</h2>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Reason for Advance</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
                  placeholder="e.g. Medical emergency, personal expense..."
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Approval Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Approved">Approved (Granted)</option>
                  <option value="Pending">Pending (Awaiting Approval)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Repayment */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6 h-full">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                <CalendarClock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Repayment Terms</h2>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Deduction Plan</label>
                  <select
                    name="repaymentTerm"
                    value={formData.repaymentTerm}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  >
                    <option value="Next Salary">Deduct full amount in Next Salary</option>
                    <option value="EMI">Deduct as EMI (Monthly Installments)</option>
                  </select>
                </div>

                {formData.repaymentTerm === 'EMI' && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-sm font-bold text-on-surface">EMI Amount per Month (₹) <span className="text-error ml-1">*</span></label>
                      <input
                        type="number"
                        name="emiAmount"
                        value={formData.emiAmount}
                        onChange={handleInputChange}
                        placeholder="e.g. 2000"
                        className={cn(
                          "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                          errors.emiAmount ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                        )}
                      />
                      {errors.emiAmount && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.emiAmount}</p>}
                    </div>
                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mt-4">
                      <p className="text-sm text-warning font-medium">
                        This amount will be automatically deducted from the employee's salary every month until the total advance is recovered.
                      </p>
                    </div>
                  </div>
                )}

                {formData.repaymentTerm === 'Next Salary' && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-2">
                    <p className="text-sm text-primary font-medium">
                      The entire advance amount will be deducted during the next salary processing cycle.
                    </p>
                  </div>
                )}
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
          <span className="font-bold tracking-wide">{submitting ? 'Saving...' : 'Save Request'}</span>
        </Button>
      </div>
    </form>
  );
}
