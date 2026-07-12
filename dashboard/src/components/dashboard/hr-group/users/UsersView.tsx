'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Users, ShieldAlert, MonitorPlay, MailWarning, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const userKPIs = [
  { title: "Total Users", value: "8", trend: "+1 this month", isPositive: true, icon: Users },
  { title: "Admin Accounts", value: "2", trend: "Full system access", isPositive: true, icon: ShieldAlert },
  { title: "Active Sessions", value: "3", trend: "Currently logged in", isPositive: true, icon: MonitorPlay },
  { title: "Pending Invites", value: "1", trend: "Needs activation", isPositive: false, icon: MailWarning },
];

const userList = [
  { id: 'USR-001', name: 'Dinesh Thori', role: 'Super Admin', email: 'admin@shop.com', status: 'Active', lastLogin: 'Just now' },
  { id: 'USR-002', name: 'Ravi Verma', role: 'Manager', email: 'ravi.v@shop.com', status: 'Active', lastLogin: '2 hours ago' },
  { id: 'USR-003', name: 'Anjali Sharma', role: 'Sales Exec', email: 'anjali.s@shop.com', status: 'Active', lastLogin: '5 hours ago' },
  { id: 'USR-004', name: 'Suresh Kumar', role: 'Viewer', email: 'suresh.k@shop.com', status: 'Inactive', lastLogin: '2 days ago' },
  { id: 'USR-005', name: 'Pooja Singh', role: 'Manager', email: 'pooja.s@shop.com', status: 'Pending', lastLogin: 'Never' },
];

export default function UsersView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'User', accessorKey: 'name', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.name}</span>
        <span className="text-xs text-on-surface-variant">{row.email}</span>
      </div>
    )},
    { header: 'System Role', accessorKey: 'role', cell: (row: any) => (
      <span className="text-sm font-bold text-on-surface bg-surface-container px-3 py-1 rounded-full border border-outline-variant/30">{row.role}</span>
    )},
    { header: 'Last Login', accessorKey: 'lastLogin', cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.lastLogin}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/users/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )},
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">System Users</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage who has access to the dashboard and their roles.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/users/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Invite User
            </Button>
          </Link>
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
              placeholder="Search by name, email or role..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <DataTable 
            columns={columns} 
            data={userList} 
          />
        </div>
      </div>
    </div>
  );
}
