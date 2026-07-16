'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CreditCard, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TaxBillingView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('settings.taxBilling.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('settings.taxBilling.description')}</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          {t('settings.taxBilling.saveChanges')}
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label={t('settings.taxBilling.gstinNumber')} defaultValue="07AAAAA0000A1Z5" />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">{t('settings.taxBilling.defaultGstRate')}</label>
            <select defaultValue="18" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
              <option value="0">{t('settings.taxBilling.gstRates.exempt')}</option>
              <option value="5">{t('settings.taxBilling.gstRates.gst5')}</option>
              <option value="12">{t('settings.taxBilling.gstRates.gst12')}</option>
              <option value="18">{t('settings.taxBilling.gstRates.gst18')}</option>
              <option value="28">{t('settings.taxBilling.gstRates.gst28')}</option>
            </select>
          </div>
          
          <Input label={t('settings.taxBilling.invoicePrefix')} defaultValue="INV-2026-" />
          <Input label={t('settings.taxBilling.nextInvoiceSequence')} type="number" defaultValue="105" />
          
          <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-bold text-on-surface">{t('settings.taxBilling.invoiceTerms')}</label>
            <textarea 
              rows={4}
              className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
              defaultValue={t('settings.taxBilling.defaultTerms')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
