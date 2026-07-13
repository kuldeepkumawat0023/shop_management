'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, UploadCloud, Info, IndianRupee, FileText, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { expenseSchema } from '@/utils/validations';
import toast from 'react-hot-toast';
import { expenseService } from '@/lib/services/expense.services';

export default function ExpenseForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    payee: '',
    category: '',
    amount: '',
    date: '',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      payee: '',
      category: '',
      amount: '',
      date: '',
      paymentMethod: 'Bank Transfer',
      status: 'Paid',
      description: ''
    });
    setErrors({});
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
      } else {
        toast.error('File size should not exceed 5MB / फ़ाइल का आकार 5MB से अधिक नहीं होना चाहिए');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
      } else {
        toast.error('File size should not exceed 5MB / फ़ाइल का आकार 5MB से अधिक नहीं होना चाहिए');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      amount: Number(formData.amount) || 0
    };

    const validationResult = expenseSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setSubmitting(true);
    const toastId = toast.loading('Saving expense... / व्यय सहेज रहा है...');
    
    try {
      const payload = {
        expenseName: submissionData.payee,
        amount: submissionData.amount,
        category: submissionData.category,
        paymentMethod: submissionData.paymentMethod,
        notes: submissionData.description,
        expenseDate: submissionData.date || new Date().toISOString()
      };
      
      const response = await expenseService.createExpense(payload);
      if (response.success) {
        toast.success('Expense saved successfully! / व्यय सफलतापूर्वक सहेजा गया!', { id: toastId });
        router.back();
      } else {
        toast.error(response.message || 'Failed to save expense / व्यय सहेजने में विफल', { id: toastId });
      }
    } catch (err: any) {
      toast.error('Failed to save expense / व्यय सहेजने में विफल', { id: toastId });
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
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Log Expense / व्यय दर्ज करें</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Record a new outgoing payment or bill / एक नया आउटगोइंग भुगतान या बिल दर्ज करें</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">General Details / सामान्य विवरण</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Payee / Vendor / प्राप्तकर्ता / विक्रेता <span className="text-error ml-1">*</span></label>
                <input
                  name="payee"
                  value={formData.payee}
                  onChange={handleInputChange}
                  placeholder="e.g. Office Supplies Inc"
                  className={cn(
                    "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.payee ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.payee && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.payee}</p>}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Expense Category / व्यय श्रेणी <span className="text-error ml-1">*</span></label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={cn(
                    "flex w-full h-10 rounded-xl bg-surface border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none",
                    errors.category ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                >
                  <option value="">Select category... / श्रेणी चुनें...</option>
                  <option value="Utilities">Utilities (Electricity, Water) / उपयोगिताएँ</option>
                  <option value="Rent">Rent</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Salaries">Salaries & Wages</option>
                  <option value="Software">Software & IT</option>
                  <option value="Misc">Miscellaneous</option>
                </select>
                {errors.category && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.category}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-on-surface">Description (Optional) / विवरण (वैकल्पिक)</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
                placeholder="Brief description of the expense..."
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <IndianRupee className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Payment Info / भुगतान जानकारी</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Amount / राशि <span className="text-error ml-1">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={cn(
                      "w-full h-10 pl-8 pr-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                      errors.amount ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                </div>
                {errors.amount && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.amount}</p>}
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Expense Date / व्यय की तिथि <span className="text-error ml-1">*</span></label>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Payment Method / भुगतान विधि</label>
                <select 
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Status / स्थिति</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Attachments */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Receipt / Bill / रसीद / बिल</h2>
            </div>
            
            <p className="text-sm text-on-surface-variant font-medium">Attach proof of payment or invoice. / भुगतान या चालान का प्रमाण संलग्न करें।</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".png,.jpg,.jpeg,.pdf"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer bg-surface-container-low hover:bg-surface-container
                ${dragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/30'}`}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-bold text-on-surface mb-1 text-center">
                {selectedFile ? selectedFile.name : 'Click or drag receipt here / रसीद यहाँ क्लिक करें या खींचें'}
              </span>
              <span className="text-xs font-medium text-on-surface-variant text-center">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'PNG, JPG, PDF (max 5MB)'}
              </span>
            </div>
          </div>
        </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Clear Form / फ़ॉर्म साफ़ करें
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel / रद्द करें
          </Button>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">{submitting ? 'Saving... / सहेज रहा है...' : 'Save Expense / व्यय सहेजें'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
