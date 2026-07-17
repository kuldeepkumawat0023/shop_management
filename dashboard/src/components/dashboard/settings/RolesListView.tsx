'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, Plus, Edit, Trash2, Users, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { roleService, CustomRoleData } from '@/lib/services/role.services';
import toast from 'react-hot-toast';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function RolesListView() {
  const [roles, setRoles] = useState<CustomRoleData[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const [resRoles, resModules] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions()
      ]);
      if (resRoles.success) {
        setRoles(resRoles.data);
      }
      if (resModules.success) {
        setModules(resModules.data);
      }
    } catch (error: any) {
      console.error("Roles fetch error:", error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const calculatePermissionCount = (permissions: string[]) => {
    if (permissions.includes('*') || permissions.includes('all')) return 'Full System Access';
    let count = 0;
    modules.forEach(mod => {
      if (permissions.includes(`${mod.module}.*`)) {
        count += mod.permissions.length;
      } else {
        mod.permissions.forEach((p: any) => {
          if (permissions.includes(p.key)) count++;
        });
      }
    });
    return `${count} Permissions`;
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading('Deleting role...');
    try {
      const res = await roleService.deleteRole(deleteTarget.id);
      if (res.success) {
        toast.success('Role deleted successfully', { id: toastId });
        setRoles(roles.filter(r => r._id !== deleteTarget.id));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete role', { id: toastId });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, roleName: string) => {
    setDeleteTarget({ id, name: roleName });
  };

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage access controls and administrative roles across the platform.</p>
        </div>
        <ActionGuard permission="roles.create">
          <Link href="/settings/roles/new">
            <Button className="gradient-button text-white shadow-md gap-2">
              <Plus className="w-4 h-4" />
              Create Custom Role
            </Button>
          </Link>
        </ActionGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role._id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group">

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">{role.roleName}</h3>
                  <div className="text-xs text-on-surface-variant font-medium mt-0.5">{role.isDefault ? 'Default Role' : 'Custom Role'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 transition-opacity -mt-1 -mr-1">
                <Button
                  variant="ghost"
                  size="icon"
                  title="View Details"
                  onClick={() => router.push(`/settings/roles/${role._id}`)}
                  className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {!role.isDefault && (
                  <ActionGuard permission="roles.update">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit Role"
                      onClick={() => router.push(`/settings/roles/${role._id}/edit`)}
                      className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </ActionGuard>
                )}
              </div>
            </div>

            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-6 flex-1">
              {role.description || 'No description provided.'}
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant font-bold flex items-center gap-2">
                  <Key className="w-4 h-4" /> Access Level
                </span>
                <span className="text-on-surface font-bold truncate max-w-[150px]" title={calculatePermissionCount(role.permissions)}>
                  {calculatePermissionCount(role.permissions)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" /> Assigned Users
                </span>
                <span className="text-on-surface font-bold bg-surface-container-high px-2 py-0.5 rounded-md">-- Members</span>
              </div>
            </div>

            <div className="w-full h-px bg-outline-variant/20 mb-4"></div>

            <div className="flex items-center justify-between">
              <StatusBadge status={role.isActive ? 'Active' : 'Inactive'} variant={(role.isActive ? 'success' : 'error') as any} />

              <div className="flex gap-2">
                {!role.isDefault && (
                  <ActionGuard permission="roles.delete">
                    <Button onClick={() => handleDeleteClick(role._id, role.roleName)} variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10" title="Delete Role">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </ActionGuard>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

        {roles.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-outline-variant/30 rounded-3xl mt-4">
            <Shield className="w-12 h-12 text-on-surface-variant/50 mb-4" />
            <h3 className="text-xl font-bold text-on-surface">No Roles Found</h3>
            <p className="text-on-surface-variant mt-2 mb-6">Get started by creating a custom role to define specific access levels.</p>
            <ActionGuard permission="roles.create">
              <Link href="/settings/roles/new">
                <Button className="gradient-button text-white px-6">Create Custom Role</Button>
              </Link>
            </ActionGuard>
          </div>
        )}
      
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        itemName={deleteTarget?.name || 'Role'}
      />
    </div>
  );
}
