'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Banknote, Calculator, ReceiptText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaySalaryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    month: 'July 2026',
    baseSalary: 25000,
    bonus: 0,
    deductions: 0,
    paymentMethod: 'Bank Transfer',
    paymentDate: '',
    remarks: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'baseSalary' || name === 'bonus' || name === 'deductions' ? Number(value) : value }));
  };

  const netSalary = formData.baseSalary + formData.bonus - formData.deductions;

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Process Salary</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Record salary payment for an employee</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Confirm Payment</span>
          </Button>
        </div>
      </div>

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
                <label className="text-sm font-bold text-on-surface">Employee</label>
                <select 
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  required
                >
                  <option value="">Select employee...</option>
                  <option value="EMP-001">Ravi Verma (Store Manager)</option>
                  <option value="EMP-002">Anjali Sharma (Sales Exec)</option>
                  <option value="EMP-003">Suresh Kumar (Warehouse)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Salary Month</label>
                <select 
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  required
                >
                  <option value="June 2026">June 2026</option>
                  <option value="July 2026">July 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Base Salary (₹)"
                name="baseSalary"
                type="number"
                value={formData.baseSalary}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Bonuses / Allowances (₹)"
                name="bonus"
                type="number"
                value={formData.bonus}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Deductions (₹) e.g. Advance, Leaves"
                name="deductions"
                type="number"
                value={formData.deductions}
                onChange={handleInputChange}
              />
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
                  <label className="text-sm font-bold text-on-surface">Payment Method</label>
                  <select 
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                    required
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <Input
                  label="Payment Date"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Internal Remarks / Reference No</label>
                <textarea 
                  name="remarks"
                  value={formData.remarks}
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
    </div>
  );
}
