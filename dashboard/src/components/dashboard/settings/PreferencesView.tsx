'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Sliders, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PreferencesView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('settings.preferences.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('settings.preferences.description')}</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          {t('settings.preferences.saveChanges')}
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">{t('settings.preferences.currency')}</label>
            <select defaultValue="INR" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
              <option value="INR">{t('settings.preferences.currencies.inr')}</option>
              <option value="USD">{t('settings.preferences.currencies.usd')}</option>
              <option value="EUR">{t('settings.preferences.currencies.eur')}</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">{t('settings.preferences.timezone')}</label>
            <select defaultValue="IST" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
              <option value="IST">{t('settings.preferences.timezones.ist')}</option>
              <option value="UTC">{t('settings.preferences.timezones.utc')}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full mt-2">
            <label className="text-sm font-bold text-on-surface">{t('settings.preferences.defaultReceiptFormat')}</label>
            <select defaultValue="A4" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
              <option value="A4">{t('settings.preferences.receiptFormats.a4')}</option>
              <option value="thermal_80">{t('settings.preferences.receiptFormats.thermal80')}</option>
              <option value="thermal_58">{t('settings.preferences.receiptFormats.thermal58')}</option>
            </select>
          </div>
          
          <div className="col-span-1 flex flex-col gap-1.5 w-full justify-center mt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="block bg-primary w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-6"></div>
              </div>
              <span className="text-sm font-bold text-on-surface">{t('settings.preferences.enableEmailNotifications')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
