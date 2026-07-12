'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, ShieldAlert, Key, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    role: '',
    status: 'Pending',
    requirePasswordReset: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Invite System User</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Grant a new user access to the dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Send Invite</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Account Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <UserCheck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Account Information</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Rahul Sharma"
                required
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="rahul.s@example.com"
                required
              />
              
              <Input
                label="Username (Optional)"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="rahuls123"
              />
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Security Settings</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    name="requirePasswordReset"
                    checked={formData.requirePasswordReset}
                    onChange={handleInputChange}
                    className="peer w-5 h-5 appearance-none rounded border-2 border-outline-variant/50 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Require password reset</span>
                  <span className="text-xs text-on-surface-variant font-medium">User must change password on their first login.</span>
                </div>
              </label>
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-2">
                <p className="text-sm text-primary font-medium">
                  An invitation link will be sent to the user's email address to set up their password and activate their account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Role & Access */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Role & Permissions</h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">System Role</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  required
                >
                  <option value="">Select a role...</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Manager">Manager (Edit Products/Sales)</option>
                  <option value="Sales Exec">Sales Executive (POS & Sales only)</option>
                  <option value="Viewer">Viewer (Read Only)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Account Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Pending">Pending (Wait for invite acceptance)</option>
                  <option value="Active">Active (Force Activate)</option>
                  <option value="Inactive">Inactive (Suspended)</option>
                </select>
              </div>

              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/10 mt-4">
                <h3 className="text-sm font-bold text-on-surface mb-2">Role Preview</h3>
                {formData.role === 'Super Admin' && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <strong>Super Admins</strong> have unrestricted access to all modules, settings, and can manage other users.
                  </p>
                )}
                {formData.role === 'Manager' && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <strong>Managers</strong> can add/edit inventory, view financial reports, and process sales, but cannot change system settings or delete data permanently.
                  </p>
                )}
                {formData.role === 'Sales Exec' && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <strong>Sales Executives</strong> only have access to the Point of Sale, creating bills, and viewing their own daily sales reports.
                  </p>
                )}
                {formData.role === 'Viewer' && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <strong>Viewers</strong> can see dashboards and data but cannot add, edit, or delete any records.
                  </p>
                )}
                {!formData.role && (
                  <p className="text-sm text-on-surface-variant italic">
                    Select a role to see its permissions preview.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
