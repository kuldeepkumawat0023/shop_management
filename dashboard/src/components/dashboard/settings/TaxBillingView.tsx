'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CreditCard, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { settingsService } from '@/lib/services/settings.services';
import { shopService } from '@/lib/services/shop.services';
import toast from 'react-hot-toast';

export default function TaxBillingView() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Read-only shop data
  const [gstNumber, setGstNumber] = useState('');

  // Editable settings
  const [form, setForm] = useState({
    invoicePrefix: 'INV-',
    taxType: 'GST',
    printFormat: 'Thermal-80mm',
    termsAndConditions: 'Thank you for your business!'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch shop for GSTIN (read-only here)
      const shopRes = await shopService.getMyShop();
      if (shopRes.success && shopRes.data) {
        setGstNumber(shopRes.data.gstNumber || '');
      }

      // Fetch settings
      const settingsRes = await settingsService.getSettings();
      if (settingsRes.success && settingsRes.data) {
        setForm({
          invoicePrefix: settingsRes.data.invoicePrefix || 'INV-',
          taxType: settingsRes.data.taxType || 'GST',
          printFormat: settingsRes.data.printFormat || 'Thermal-80mm',
          termsAndConditions: settingsRes.data.termsAndConditions || 'Thank you for your business!',
        });
      }
    } catch (error: any) {
      toast.error('Failed to load tax and billing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await settingsService.updateSettings(form);
      if (res.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(res.message || 'Failed to update settings');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-medium">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('settings.taxBilling.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('settings.taxBilling.description')}</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : t('settings.taxBilling.saveChanges')}
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label={t('settings.taxBilling.gstinNumber')} 
            value={gstNumber}
            disabled 
            placeholder="Set in Store Profile"
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">Tax Type</label>
            <select 
              name="taxType"
              value={form.taxType}
              onChange={handleChange}
              className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
            >
              <option value="GST">GST (India)</option>
              <option value="VAT">VAT</option>
              <option value="None">None</option>
            </select>
          </div>
          
          <Input 
            label={t('settings.taxBilling.invoicePrefix')} 
            name="invoicePrefix"
            value={form.invoicePrefix}
            onChange={handleChange}
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">Print Format</label>
            <select 
              name="printFormat"
              value={form.printFormat}
              onChange={handleChange}
              className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
            >
              <option value="A4">A4 Size</option>
              <option value="Thermal-80mm">Thermal 80mm</option>
              <option value="Thermal-58mm">Thermal 58mm</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-bold text-on-surface">{t('settings.taxBilling.invoiceTerms')}</label>
            <textarea 
              name="termsAndConditions"
              rows={4}
              value={form.termsAndConditions}
              onChange={handleChange}
              className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
