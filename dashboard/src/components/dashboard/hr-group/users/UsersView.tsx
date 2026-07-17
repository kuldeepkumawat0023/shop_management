'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { Plus, Download, Filter, Search, Users, ShieldAlert, MonitorPlay, MailWarning, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/lib/services/user.services';
import { useTranslation } from 'react-i18next';
import { AuthUser } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
};

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
];

const getGradient = (id?: string) => {
  if (!id) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length];
};

export default function UsersView() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      toast.error(t('hr.usersView.loadError'), { id: 'failed-to-load-users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await userService.deleteProfile(deleteTarget.id);
      if (res.success) {
        toast.success(t('hr.usersView.userDeactivated'));
        fetchUsers();
      } else {
        toast.error(res.message || t('hr.usersView.deactivateFailed'));
      }
    } catch (error) {
      toast.error(t('hr.usersView.deactivateFailed'), { id: 'failed-to-deactivate-user' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const filteredUsers = users.filter((u) => 
    (u.fullname && u.fullname.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { header: t('hr.usersView.profile'), accessorKey: 'profile', cell: (row: any) => (
      <div className="flex items-center gap-3">
        {row.profilePhoto && !brokenImages[row._id] ? (
          <img
            src={row.profilePhoto}
            alt={row.fullname}
            onError={() => setBrokenImages(prev => ({ ...prev, [row._id]: true }))}
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-outline-variant/20"
          />
        ) : (
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase shrink-0 bg-gradient-to-br text-white",
            getGradient(row._id)
          )}>
            {getInitials(row.fullname)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-on-surface truncate max-w-[150px] sm:max-w-xs">{row.fullname || '—'}</span>
          <span className="text-xs font-semibold text-on-surface-variant truncate max-w-[150px] sm:max-w-xs">{row.email}</span>
        </div>
      </div>
    )},
    { header: t('hr.usersView.systemRole'), accessorKey: 'role', cell: (row: any) => (
      <span className="text-xs font-bold text-on-surface bg-surface-container px-3 py-1 rounded-full border border-outline-variant/30 uppercase tracking-wider">{row.role}</span>
    )},
    { header: t('hr.usersView.phone'), accessorKey: 'phone', cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.phoneNumber || 'N/A'}</span> },
    { header: t('hr.usersView.joined'), accessorKey: 'joined', cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{formatDate(row.createdAt)}</span> },
    { header: t('hr.usersView.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.isActive !== false ? t('hr.usersView.active') : t('hr.usersView.inactive')} /> },
    { header: t('hr.usersView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/users/${row._id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <ActionGuard permission="users.update">
          <Link href={`/users/${row._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </ActionGuard>
        <ActionGuard permission="users.delete">
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row._id, row.fullname)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];

  // Dynamic KPIs calculation
  const totalUsers = users.length;
  const adminAccounts = users.filter(u => u.role === 'super_admin' || u.role === 'manager').length;
  const activeSessions = users.filter(u => u.isActive !== false).length; 
  const pendingInvites = users.filter(u => (u as any).isPending === true).length;

  const userKPIs = [
    { title: t('hr.usersView.totalUsers'), value: totalUsers.toString(), trend: t('hr.usersView.allRegistered'), isPositive: true, icon: Users },
    { title: t('hr.usersView.adminAccounts'), value: adminAccounts.toString(), trend: t('hr.usersView.managersAdmins'), isPositive: true, icon: ShieldAlert },
    { title: t('hr.usersView.activeUsers'), value: activeSessions.toString(), trend: t('hr.usersView.currentlyActive'), isPositive: true, icon: MonitorPlay },
    { title: t('hr.usersView.pendingInvites'), value: pendingInvites.toString(), trend: t('hr.usersView.needsActivation'), isPositive: false, icon: MailWarning },
  ];

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('hr.usersView.systemUsers')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('hr.usersView.manageAccess')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('hr.usersView.export')}
          </Button>
          <ActionGuard permission="users.create">
            <Link href="/users/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                {t('hr.usersView.inviteUser')}
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {userKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hr.usersView.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            {t('hr.usersView.filters')}
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <DataTable 
            columns={columns} 
            data={filteredUsers} 
          />
        </div>
      </div>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        itemName={deleteTarget?.name || t('common.item')}
      />
    </div>
  );
}
