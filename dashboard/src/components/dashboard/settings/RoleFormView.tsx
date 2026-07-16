'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ShieldCheck, Save, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { roleService, CustomRoleData, PermissionModule } from '@/lib/services/role.services';
import toast from 'react-hot-toast';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { useRouter } from 'next/navigation';

export default function RoleFormView({ roleId }: { roleId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modules, setModules] = useState<PermissionModule[]>([]);
  
  const [isDefault, setIsDefault] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [roleId]);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleId ? roleService.getRoles() : Promise.resolve(null),
        roleService.getPermissions()
      ]);
      
      if (permsRes.success) setModules(permsRes.data);
      
      if (rolesRes && rolesRes.success) {
        const role = rolesRes.data.find(r => r._id === roleId);
        if (role) {
          setRoleName(role.roleName);
          setDescription(role.description || '');
          setSelectedPermissions(role.permissions || []);
          setIsDefault(!!role.isDefault);
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

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permKey)) {
        return prev.filter(p => p !== permKey);
      }
      return [...prev, permKey];
    });
  };

  const handleToggleModule = (modulePerms: string[]) => {
    const allChecked = modulePerms.every(p => selectedPermissions.includes(p));
    if (allChecked) {
      setSelectedPermissions(prev => prev.filter(p => !modulePerms.includes(p)));
    } else {
      setSelectedPermissions(prev => {
        const newPerms = new Set(prev);
        modulePerms.forEach(p => newPerms.add(p));
        return Array.from(newPerms);
      });
    }
  };

  const handleSave = async () => {
    if (!roleName) return toast.error('Role name is required');
    if (selectedPermissions.length === 0) return toast.error('Select at least one permission');
    
    setSaving(true);
    const toastId = toast.loading('Saving role...');
    
    try {
      const payload = { roleName, description, permissions: selectedPermissions };
      let res;
      
      if (!roleId) {
        res = await roleService.createRole(payload);
      } else {
        res = await roleService.updateRole(roleId, payload);
      }
      
      if (res.success) {
        toast.success(roleId ? 'Role updated successfully' : 'Role created successfully', { id: toastId });
        router.push('/settings/roles');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save role', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">
              {isDefault ? 'View Role Details' : (roleId ? 'Edit Role' : 'Create Custom Role')}
            </h2>
            <p className="text-sm font-medium text-on-surface-variant">
              {isDefault ? 'Review the exact permissions assigned to this system role.' : 'Define the exact permissions and access levels for this role.'}
            </p>
          </div>
          {!isDefault && (
            <Button onClick={handleSave} disabled={saving} className="gradient-button text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-auto flex flex-col gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Input 
            label="Role Name" 
            value={roleName} 
            onChange={e => setRoleName(e.target.value)} 
            placeholder="e.g. Finance Manager" 
            disabled={isDefault}
            className="h-12"
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              disabled={isDefault}
              className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="What can this role do?"
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-black text-on-surface tracking-wider mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Permissions Matrix
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map(mod => {
              const modulePerms = mod.permissions.map(p => p.key);
              const hasGlobalWildcard = selectedPermissions.includes('*') || selectedPermissions.includes('all');
              const hasModuleWildcard = selectedPermissions.includes(`${mod.module}.*`);
              
              const isAllChecked = hasGlobalWildcard || hasModuleWildcard || modulePerms.every(p => selectedPermissions.includes(p));
              const isSomeChecked = hasModuleWildcard || modulePerms.some(p => selectedPermissions.includes(p));

              return (
                <div key={mod.module} className="bg-surface border border-outline-variant/30 rounded-2xl p-4 flex flex-col hover:border-primary/30 transition-colors shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant/20">
                    <span className="font-bold text-base text-on-surface">{mod.label}</span>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        disabled={isDefault || hasGlobalWildcard}
                        checked={isAllChecked}
                        ref={input => {
                          if (input) input.indeterminate = !isAllChecked && isSomeChecked;
                        }}
                        onChange={() => handleToggleModule(modulePerms)}
                        className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-3">
                    {mod.permissions.map(perm => (
                      <label key={perm.key} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          disabled={isDefault || hasGlobalWildcard || hasModuleWildcard}
                          checked={selectedPermissions.includes(perm.key) || isAllChecked}
                          onChange={() => handleTogglePermission(perm.key)}
                          className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
