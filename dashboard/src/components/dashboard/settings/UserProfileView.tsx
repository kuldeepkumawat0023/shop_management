'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { User, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UserProfileView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('settings.userProfile.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('settings.userProfile.description')}</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          {t('settings.userProfile.saveChanges')}
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-surface rounded-2xl border border-outline-variant/20 mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden relative">
            <User className="w-10 h-10" />
          </div>
          <div className="flex flex-col text-center sm:text-left">
            <h4 className="font-bold text-on-surface text-lg">{t('settings.userProfile.adminUser')}</h4>
            <p className="text-sm text-on-surface-variant mt-1 mb-3">{t('settings.userProfile.administrator')}</p>
            <Button variant="outline" size="sm" className="w-fit sm:mx-0 rounded-lg font-bold text-xs">
              {t('settings.userProfile.changePhoto')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label={t('settings.userProfile.fullName')} defaultValue="Admin User" />
          <Input label={t('settings.userProfile.emailAddress')} type="email" defaultValue="admin@superstore.com" />
          <Input label={t('settings.userProfile.phoneNumber')} defaultValue="+91 99999 00000" />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">{t('settings.userProfile.role')}</label>
            <input 
              type="text" 
              value={t('settings.userProfile.administrator')} 
              disabled
              className="flex w-full h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 px-3 text-sm text-on-surface-variant font-medium cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
