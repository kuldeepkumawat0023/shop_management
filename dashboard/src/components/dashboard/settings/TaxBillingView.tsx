'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CreditCard, Save } from 'lucide-react';

export default function TaxBillingView() {
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Tax & Billing</h2>
          <p className="text-sm font-medium text-on-surface-variant">Configure GST settings and invoice formats.</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="GSTIN Number" defaultValue="07AAAAA0000A1Z5" />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">Default GST Rate (%)</label>
            <select defaultValue="18" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
              <option value="0">0% (Exempt)</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>
          
          <Input label="Invoice Prefix" defaultValue="INV-2026-" />
          <Input label="Next Invoice Sequence" type="number" defaultValue="105" />
          
          <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-bold text-on-surface">Invoice Terms & Conditions</label>
            <textarea 
              rows={4}
              className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
              defaultValue="1. Goods once sold will not be taken back.&#10;2. Subject to local jurisdiction.&#10;3. Interest @18% p.a. will be charged if not paid within 30 days."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
