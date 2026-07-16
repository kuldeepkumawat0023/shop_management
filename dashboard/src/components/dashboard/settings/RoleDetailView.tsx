'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Shield, ShieldCheck, Key, CheckCircle2, UserCheck } from 'lucide-react';
import { roleService } from '@/lib/services/role.services';
import toast from 'react-hot-toast';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import Link from 'next/link';
import ActionGuard from '@/components/auth/ActionGuard';

interface PermissionModule {
  module: string;
  label: string;
  permissions: { key: string; label: string }[];
}

interface RoleDetailViewProps {
  roleId: string;
}

export default function RoleDetailView({ roleId }: RoleDetailViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<any>(null);
  const [modules, setModules] = useState<PermissionModule[]>([]);

  useEffect(() => {
    fetchData();
  }, [roleId]);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions()
      ]);
      
      if (permsRes.success) setModules(permsRes.data);
      
      if (rolesRes && rolesRes.success) {
        const foundRole = rolesRes.data.find(r => r._id === roleId);
        if (foundRole) {
          setRole(foundRole);
        } else {
          toast.error('Role not found');
          router.push('/settings/roles');
        }
      }
    } catch (error: any) {
      console.error('Error fetching role data:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load role data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ViewPageSkeleton />;
  if (!role) return null;

  const isDefault = !!role.isDefault;
  const permissions = role.permissions || [];
  const hasGlobalWildcard = permissions.includes('*') || permissions.includes('all');

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">
                {role.roleName}
              </h2>
              {isDefault ? (
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">System Default</span>
              ) : (
                <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20">Custom Role</span>
              )}
            </div>
            <p className="text-sm font-medium text-on-surface-variant mt-1">Review the details and exact permissions assigned to this role.</p>
          </div>
          {!isDefault && (
            <ActionGuard permission="roles.update">
              <Link href={`/settings/roles/${roleId}/edit`}>
                <Button className="gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                  <Edit className="w-4 h-4" />
                  Edit Role
                </Button>
              </Link>
            </ActionGuard>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Role Overview</h3>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {role.description || 'No description provided for this role.'}
              </p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Access Level</div>
                  <div className="font-black text-on-surface">
                    {hasGlobalWildcard ? 'Full System Access' : `${permissions.length} Permissions`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm">
          <h4 className="text-lg font-black text-on-surface tracking-wider mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Permissions Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(mod => {
              const modulePerms = mod.permissions.map(p => p.key);
              const hasModuleWildcard = permissions.includes(`${mod.module}.*`);
              
              // Only show the module if the role has SOME permissions in it (or global wildcard)
              const roleHasModulePerm = hasGlobalWildcard || hasModuleWildcard || mod.permissions.some(p => permissions.includes(p.key));
              
              if (!roleHasModulePerm) return null;

              return (
                <div key={mod.module} className="bg-surface border border-outline-variant/30 rounded-2xl p-4 flex flex-col shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant/20">
                    <span className="font-bold text-base text-on-surface flex items-center gap-2">
                      {mod.label}
                    </span>
                    {(hasGlobalWildcard || hasModuleWildcard) && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-md border border-success/20 uppercase">
                        Full Access
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {mod.permissions.map(perm => {
                      const hasPerm = hasGlobalWildcard || hasModuleWildcard || permissions.includes(perm.key);
                      
                      return (
                        <div key={perm.key} className={`flex items-center gap-3 ${hasPerm ? 'opacity-100' : 'opacity-40'}`}>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${hasPerm ? 'bg-primary text-white shadow-sm' : 'bg-surface-variant border border-outline-variant/50'}`}>
                            {hasPerm && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-sm font-medium ${hasPerm ? 'text-on-surface' : 'text-on-surface-variant line-through'}`}>
                            {perm.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {!hasGlobalWildcard && permissions.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant font-medium">
              No permissions assigned to this role.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
