'use client';

import React, { useState } from 'react';
import { Key, Shield, Plus, Edit, Trash2, Users, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';

const mockRoles = [
  { id: 'RL-01', name: 'Super Admin', users: 2, access: 'Full System Access', status: 'Active', description: 'Complete control over all system modules and settings.' },
  { id: 'RL-02', name: 'Support Agent', users: 15, access: 'View/Edit Branches, View Tickets', status: 'Active', description: 'Can manage customer queries and view basic branch data.' },
  { id: 'RL-03', name: 'Finance Manager', users: 4, access: 'View Revenue, Manage Payouts', status: 'Active', description: 'Handles platform finances, payouts, and revenue analytics.' },
  { id: 'RL-04', name: 'Marketing Lead', users: 3, access: 'Manage Campaigns & Offers', status: 'Active', description: 'Controls promotional banners, coupons, and email campaigns.' },
  { id: 'RL-05', name: 'Guest Observer', users: 1, access: 'Read-only Analytics', status: 'Suspended', description: 'Temporary read-only access to basic performance charts.' },
  { id: 'RL-06', name: 'Branch Manager', users: 52, access: 'Manage Own Branch Details', status: 'Active', description: 'Local branch administrators who manage their own staff and orders.' },
];

export default function RolesView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage access controls and administrative roles across the platform.</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="gradient-button text-white shadow-md gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockRoles.map((role) => (
          <div key={role.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">{role.name}</h3>
                  <div className="text-xs text-on-surface-variant font-medium mt-0.5">{role.id}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-6 flex-1">
              {role.description}
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant font-bold flex items-center gap-2">
                  <Key className="w-4 h-4" /> Access Level
                </span>
                <span className="text-on-surface font-bold truncate max-w-[150px]" title={role.access}>{role.access}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" /> Assigned Users
                </span>
                <span className="text-on-surface font-bold bg-surface-container-high px-2 py-0.5 rounded-md">{role.users} Members</span>
              </div>
            </div>

            <div className="w-full h-px bg-outline-variant/20 mb-4"></div>

            <div className="flex items-center justify-between">
              <StatusBadge status={role.status} variant={(role.status === 'Active' ? 'success' : 'error') as any} />
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high" title="Duplicate Role">
                  <Copy className="w-4 h-4" />
                </Button>
                {role.id !== 'RL-01' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10" title="Delete Role">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* Temporary placeholder for Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-on-surface">Custom Role Builder</h2>
              <p className="text-sm font-medium text-on-surface-variant mt-2">The permissions matrix interface will be loaded here.</p>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/20">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Close</Button>
              <Button className="gradient-button text-white shadow-md">Coming Soon</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
