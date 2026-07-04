'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Shield, ShieldAlert, Users, Plus, Edit, Trash2, Key, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import InviteMemberModal from './InviteMemberModal';
import EditMemberModal from './EditMemberModal';
import DeleteMemberModal from './DeleteMemberModal';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock Data
const initialTeam = [
  { id: 'usr_01', name: 'Kuldeep Kumawat', email: 'kuldeep@smartshop.com', role: 'Super Admin', status: 'Active', lastLogin: 'Oct 24, 2026, 10:30 AM' },
  { id: 'usr_02', name: 'Amit Singh', email: 'amit@smartshop.com', role: 'Support Agent', status: 'Active', lastLogin: 'Oct 24, 2026, 09:15 AM' },
  { id: 'usr_03', name: 'Ravi Tech Support', email: 'support1@smartshop.com', role: 'Support Agent', status: 'Active', lastLogin: 'Oct 23, 2026, 04:45 PM' },
  { id: 'usr_04', name: 'Priya CS', email: 'priya@smartshop.com', role: 'Support Agent', status: 'Suspended', lastLogin: 'Oct 10, 2026, 11:20 AM' },
];

export default function TeamView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [teamData, setTeamData] = useState(initialTeam);
  const tabs = ['All', 'Super Admin', 'Support Agent', 'Suspended'];

  // Modal States
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  const [editModal, setEditModal] = useState<{isOpen: boolean, member: any | null}>({
    isOpen: false,
    member: null
  });
  
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, member: any | null}>({
    isOpen: false,
    member: null
  });

  const filteredData = teamData.filter(member => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Suspended') return member.status === 'Suspended';
    return member.role === activeTab;
  });

  const handleRowClick = (member: any) => {
    router.push(`/team/${member.id}`);
  };

  const handleEditClick = (e: React.MouseEvent, member: any) => {
    e.stopPropagation();
    setEditModal({ isOpen: true, member });
  };

  const handleDeleteClick = (e: React.MouseEvent, member: any) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, member });
  };

  const confirmDelete = () => {
    if (!deleteModal.member) return;
    setTeamData(prev => prev.filter(m => m.id !== deleteModal.member.id));
    toast.success(`${deleteModal.member.name}'s access revoked.`);
    setDeleteModal({ isOpen: false, member: null });
  };

  const columns = [
    {
      header: 'Team Member',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{row.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">{row.name}</p>
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (row: any) => {
        const isSuper = row.role === 'Super Admin';
        return (
          <div className="flex items-center gap-2">
            {isSuper ? <Shield className="w-4 h-4 text-secondary" /> : <Users className="w-4 h-4 text-on-surface-variant" />}
            <span className={cn("text-sm font-bold", isSuper ? "text-secondary" : "text-on-surface-variant")}>
              {row.role}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{row.lastLogin}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge status={row.status} variant={(row.status === 'Active' ? 'success' : 'error') as any} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => handleEditClick(e, row)}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            title="Edit Details"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.role !== 'Super Admin' && (
            <button 
              onClick={(e) => handleDeleteClick(e, row)}
              className="w-8 h-8 rounded-lg hover:bg-error/10 flex items-center justify-center text-error transition-colors"
              title="Revoke Access"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const TabsComponent = (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start lg:self-auto overflow-x-auto max-w-[calc(100vw-2rem)] lg:max-w-none no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Team Management</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage Super Admins and Support Agents for the platform.</p>
        </div>
        <Button 
          onClick={() => setIsInviteOpen(true)}
          className="gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bold tracking-wide">Invite Member</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Staff"
          value={teamData.length.toString()}
          icon={Users}
          colorTheme="primary"
          trend="1"
          trendDirection="up"
          trendLabel="NEW HIRES"
        />
        <StatsCard
          title="Super Admins"
          value={teamData.filter(a => a.role === 'Super Admin').length.toString()}
          icon={Shield}
          colorTheme="secondary"
          trend="0"
          trendDirection="up"
          trendLabel="NO CHANGE"
        />
        <StatsCard
          title="Support Agents"
          value={teamData.filter(a => a.role === 'Support Agent' && a.status === 'Active').length.toString()}
          icon={Key}
          colorTheme="success"
          trend="1"
          trendDirection="up"
          trendLabel="ACTIVE"
        />
        <StatsCard
          title="Suspended"
          value={teamData.filter(a => a.status === 'Suspended').length.toString()}
          icon={ShieldAlert}
          colorTheme="warning"
          trend="0"
          trendDirection="down"
          trendLabel="BLOCKED ACCOUNTS"
        />
      </div>

      {/* Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col mb-6">
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Staff List</h2>
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search by name or email..."
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent hover-row-pointer"
        />
      </div>

      <InviteMemberModal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
        onSave={(data) => {
          setTeamData(prev => [{ id: `usr_${Date.now()}`, lastLogin: 'Never', ...data }, ...prev]);
          toast.success(`Invitation sent to ${data.email}.`);
          setIsInviteOpen(false);
        }}
      />

      <EditMemberModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, member: null })}
        member={editModal.member}
        onSave={(data) => {
          if (editModal.member) {
            setTeamData(prev => prev.map(m => m.id === editModal.member.id ? { ...m, ...data } : m));
            toast.success('Team member updated successfully.');
          }
          setEditModal({ isOpen: false, member: null });
        }}
      />

      <DeleteMemberModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, member: null })}
        onConfirm={confirmDelete}
        member={deleteModal.member}
      />
    </div>
  );
}
