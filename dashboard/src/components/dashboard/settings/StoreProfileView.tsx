'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Building2, Save, Upload } from 'lucide-react';

export default function StoreProfileView() {
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Store Profile</h2>
          <p className="text-sm font-medium text-on-surface-variant">Update your business details and logo.</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-surface rounded-2xl border border-outline-variant/20 mb-8">
          <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant overflow-hidden relative group cursor-pointer">
            <Building2 className="w-8 h-8 opacity-50" />
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center text-white transition-all">
              <Upload className="w-5 h-5 mb-1" />
            </div>
          </div>
          <div className="flex flex-col text-center sm:text-left">
            <h4 className="font-bold text-on-surface text-sm">Store Logo</h4>
            <p className="text-xs text-on-surface-variant mt-1 mb-3">Recommended size: 512x512px (PNG, JPG)</p>
            <Button variant="outline" size="sm" className="w-fit sm:mx-0 rounded-lg font-bold text-xs">
              Upload Logo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Store Name" defaultValue="My Super Store" />
          <Input label="Tagline / Slogan" defaultValue="Quality you can trust" />
          <Input label="Contact Email" type="email" defaultValue="contact@superstore.com" />
          <Input label="Phone Number" defaultValue="+91 98765 43210" />
          <div className="col-span-1 md:col-span-2">
            <Input label="Store Address" defaultValue="123, Market Street, New Delhi - 110001" />
          </div>
        </div>
      </div>
    </div>
  );
}
