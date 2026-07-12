'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Banknote, CalendarClock, MessageSquareText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdvanceForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    dateRequested: '',
    repaymentTerm: 'Next Salary',
    emiAmount: '',
    status: 'Approved',
    reason: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Grant Salary Advance</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Record a new advance payment for an employee</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Save Request</span>
          </Button>
        </div>
      </div>

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
                  <option value="EMP-004">Megha Gupta (Cashier)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Advance Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g. 5000"
                required
              />
              <Input
                label="Date Requested"
                name="dateRequested"
                type="date"
                value={formData.dateRequested}
                onChange={handleInputChange}
                required
              />
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
                  required
                >
                  <option value="Next Salary">Deduct full amount in Next Salary</option>
                  <option value="EMI">Deduct as EMI (Monthly Installments)</option>
                </select>
              </div>
              
              {formData.repaymentTerm === 'EMI' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <Input
                    label="EMI Amount per Month (₹)"
                    name="emiAmount"
                    type="number"
                    value={formData.emiAmount}
                    onChange={handleInputChange}
                    placeholder="e.g. 2000"
                    required={formData.repaymentTerm === 'EMI'}
                  />
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
  );
}
