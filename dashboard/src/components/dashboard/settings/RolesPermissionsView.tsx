'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { ShieldCheck, Save, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RolesPermissionsView() {
  const { t } = useTranslation();
  const permissions = [
    { moduleKey: 'dashboard', read: true, write: true, delete: false },
    { moduleKey: 'inventory', read: true, write: true, delete: true },
    { moduleKey: 'salesPos', read: true, write: true, delete: true },
    { moduleKey: 'purchases', read: true, write: true, delete: false },
    { moduleKey: 'reports', read: true, write: false, delete: false },
    { moduleKey: 'settings', read: true, write: true, delete: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('settings.rolesPermissions.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('settings.rolesPermissions.description')}</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          {t('settings.rolesPermissions.saveChanges')}
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        
        <div className="flex flex-col gap-1.5 w-full md:w-1/2 mb-8">
          <label className="text-sm font-bold text-on-surface">{t('settings.rolesPermissions.selectRoleToEdit')}</label>
          <select defaultValue="manager" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
            <option value="admin">{t('settings.rolesPermissions.roles.admin')}</option>
            <option value="manager">{t('settings.rolesPermissions.roles.manager')}</option>
            <option value="cashier">{t('settings.rolesPermissions.roles.cashier')}</option>
            <option value="staff">{t('settings.rolesPermissions.roles.staff')}</option>
          </select>
        </div>

        <div className="border border-outline-variant/20 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider">{t('settings.rolesPermissions.columns.module')}</th>
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider text-center">{t('settings.rolesPermissions.columns.viewRead')}</th>
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider text-center">{t('settings.rolesPermissions.columns.createEdit')}</th>
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider text-center">{t('settings.rolesPermissions.columns.delete')}</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, idx) => (
                <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container/30 transition-colors">
                  <td className="p-4 font-bold text-on-surface">{t(`settings.rolesPermissions.modules.${perm.moduleKey}`)}</td>
                  <td className="p-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary/20" defaultChecked={perm.read} />
                    </label>
                  </td>
                  <td className="p-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary/20" defaultChecked={perm.write} />
                    </label>
                  </td>
                  <td className="p-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-outline-variant/30 text-error focus:ring-error/20" defaultChecked={perm.delete} />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
