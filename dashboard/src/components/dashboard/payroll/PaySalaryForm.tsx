'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Banknote, Calculator, ReceiptText, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { salarySchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function PaySalaryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    month: 'July 2026',
    year: '2026', // Added year to match schema
    baseSalary: 25000,
    bonus: 0,
    deductions: 0,
    paymentMethod: 'Bank Transfer',
    paymentDate: '',
    notes: '' // renamed from remarks to match schema
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'baseSalary' || name === 'bonus' || name === 'deductions' ? Number(value) : value }));
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
      month: 'July 2026',
      year: '2026',
      baseSalary: 25000,
      bonus: 0,
      deductions: 0,
      paymentMethod: 'Bank Transfer',
      paymentDate: '',
      notes: ''
    });
    setErrors({});
  };

  const netSalary = formData.baseSalary + formData.bonus - formData.deductions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      baseSalary: Number(formData.baseSalary) || 0,
      bonuses: Number(formData.bonus) || 0,
      deductions: Number(formData.deductions) || 0
    };

    const validationResult = salarySchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setSubmitting(true);
    const toastId = toast.loading('Processing salary...');
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Salary processed successfully!', { id: toastId });
      router.back();
    } catch (err: any) {
      toast.error('Failed to process salary', { id: toastId });
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
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Process Salary</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Record salary payment for an employee</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Calculation */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Calculator className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Payroll Details</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                </select>
                {errors.employeeId && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.employeeId}</p>}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Salary Month <span className="text-error ml-1">*</span></label>
                <select 
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className={cn(
                    "flex w-full h-10 rounded-xl bg-surface border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none",
                    errors.month ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                >
                  <option value="June 2026">June 2026</option>
                  <option value="July 2026">July 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
                {errors.month && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.month}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Base Salary (₹) <span className="text-error ml-1">*</span></label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all",
                    errors.baseSalary ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.baseSalary && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.baseSalary}</p>}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Bonuses / Allowances (₹)</label>
                <input
                  type="number"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Deductions (₹) e.g. Advance, Leaves</label>
                <input
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Final Net & Payment Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary/5 rounded-2xl shadow-sm border border-primary/20 p-6 flex flex-col items-center justify-center text-center gap-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Net Salary Payable</h3>
            <p className="text-5xl font-black text-on-surface tracking-tighter">₹{netSalary.toLocaleString()}</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Banknote className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Payment Information</h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                  {errors.paymentMethod && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.paymentMethod}</p>}
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Payment Date <span className="text-error ml-1">*</span></label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all",
                      errors.paymentDate ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                  {errors.paymentDate && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.paymentDate}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Internal Remarks / Reference No</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
                  placeholder="e.g. UTR Number, or reasoning for deductions..."
                />
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
            <span className="font-bold tracking-wide">{submitting ? 'Processing...' : 'Confirm Payment'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
