'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { ShieldCheck, Save, Check } from 'lucide-react';

export default function RolesPermissionsView() {
  const permissions = [
    { module: 'Dashboard', read: true, write: true, delete: false },
    { module: 'Inventory', read: true, write: true, delete: true },
    { module: 'Sales & POS', read: true, write: true, delete: true },
    { module: 'Purchases', read: true, write: true, delete: false },
    { module: 'Reports', read: true, write: false, delete: false },
    { module: 'Settings', read: true, write: true, delete: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Roles & Permissions</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage what each role can access and do.</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        
        <div className="flex flex-col gap-1.5 w-full md:w-1/2 mb-8">
          <label className="text-sm font-bold text-on-surface">Select Role to Edit</label>
          <select defaultValue="manager" className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none">
            <option value="admin">Administrator (Full Access)</option>
            <option value="manager">Store Manager</option>
            <option value="cashier">Cashier</option>
            <option value="staff">General Staff</option>
          </select>
        </div>

        <div className="border border-outline-variant/20 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider">Module</th>
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider text-center">View / Read</th>
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider text-center">Create / Edit</th>
                <th className="p-4 text-sm font-bold text-on-surface uppercase tracking-wider text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, idx) => (
                <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container/30 transition-colors">
                  <td className="p-4 font-bold text-on-surface">{perm.module}</td>
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
