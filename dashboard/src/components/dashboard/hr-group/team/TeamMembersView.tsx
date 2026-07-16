'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { Plus, Download, Filter, Search, Users, UserCheck, CalendarOff, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { teamService, StaffData } from '@/lib/services/team.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import ActionGuard from '@/components/auth/ActionGuard';

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

export default function TeamMembersView() {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await teamService.getStaff();
      if (res.success && res.data) {
        setStaffList(res.data);
      }
    } catch (error) {
      toast.error(t('hr.teamMembersView.loadError'), { id: 'failed-to-load-team-members' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(t('hr.teamMembersView.confirmDelete'))) {
      try {
        const res = await teamService.deleteStaff(id);
        if (res.success) {
          toast.success(t('hr.teamMembersView.memberDeleted'));
          fetchStaff();
        } else {
          toast.error(res.message || t('hr.teamMembersView.deleteFailed'));
        }
      } catch (error) {
        toast.error(t('hr.teamMembersView.deleteFailed'), { id: 'failed-to-remove-staff-member' });
      }
    }
  };

  const filteredStaff = staffList.filter((s) => 
    (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.role && s.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.mobile && s.mobile.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { header: t('hr.teamMembersView.profile'), accessorKey: 'profile', cell: (row: any) => (
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase shrink-0 bg-gradient-to-br text-white",
          getGradient(row._id)
        )}>
          {getInitials(row.name)}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-on-surface truncate max-w-[150px] sm:max-w-xs">{row.name || '—'}</span>
          <span className="text-xs font-semibold text-on-surface-variant truncate max-w-[150px] sm:max-w-xs">{row.userId?.email || t('hr.teamMembersView.noEmail')}</span>
        </div>
      </div>
    )},
    { header: t('hr.teamMembersView.role'), accessorKey: 'role', cell: (row: any) => (
      <span className="text-sm font-medium text-on-surface">{row.role}</span>
    )},
    { header: t('hr.teamMembersView.phone'), accessorKey: 'phone', cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.mobile || 'N/A'}</span> },
    { header: t('hr.teamMembersView.joinDate'), accessorKey: 'joinDate', cell: (row: any) => <span className="text-sm text-on-surface-variant">{formatDate(row.joiningDate)}</span> },
    { header: t('hr.teamMembersView.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.isActive !== false ? t('hr.teamMembersView.active') : t('hr.teamMembersView.inactive')} /> },
    { header: t('hr.teamMembersView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/team/${row._id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <ActionGuard permission="team.update">
          <Link href={`/team/${row._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </ActionGuard>
        <ActionGuard permission="team.delete">
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row._id)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];

  // Dynamic KPIs calculation
  const totalEmployees = staffList.length;
  const activeStaff = staffList.filter(s => s.isActive !== false).length;
  const onLeave = 0; // Backend does not support leave tracking yet
  const newHires = staffList.filter(s => {
    if (!s.joiningDate) return false;
    const joinDate = new Date(s.joiningDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate >= thirtyDaysAgo;
  }).length;

  const teamKPIs = [
    { title: t('hr.teamMembersView.totalEmployees'), value: totalEmployees.toString(), trend: t('hr.teamMembersView.registeredStaff'), isPositive: true, icon: Users },
    { title: t('hr.teamMembersView.activeStaff'), value: activeStaff.toString(), trend: t('hr.teamMembersView.currentlyWorking'), isPositive: true, icon: UserCheck },
    { title: t('hr.teamMembersView.onLeave'), value: onLeave.toString(), trend: t('hr.teamMembersView.comingSoon'), isPositive: false, icon: CalendarOff },
    { title: t('hr.teamMembersView.newHires'), value: newHires.toString(), trend: t('hr.teamMembersView.inLast30Days'), isPositive: true, icon: UserPlus },
  ];

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('hr.teamMembersView.teamMembers')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('hr.teamMembersView.manageEmployees')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('hr.teamMembersView.export')}
          </Button>
          <ActionGuard permission="team.create">
            <Link href="/team/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                {t('hr.teamMembersView.addMember')}
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {teamKPIs.map((kpi, idx) => (
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
              placeholder={t('hr.teamMembersView.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            {t('hr.teamMembersView.filters')}
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <DataTable 
            columns={columns} 
            data={filteredStaff} 
          />
        </div>
      </div>
    </div>
  );
}
