'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Users, UserCheck, CalendarOff, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const teamKPIs = [
  { title: "Total Employees", value: "24", trend: "+2 this month", isPositive: true, icon: Users },
  { title: "Active Staff", value: "21", trend: "Currently working", isPositive: true, icon: UserCheck },
  { title: "On Leave", value: "3", trend: "Returning next week", isPositive: false, icon: CalendarOff },
  { title: "New Hires", value: "2", trend: "In last 30 days", isPositive: true, icon: UserPlus },
];

const teamList = [
  { id: 'EMP-001', name: 'Ravi Verma', role: 'Store Manager', department: 'Management', email: 'ravi.v@example.com', phone: '+91 98765 11111', status: 'Active', joinDate: 'Jan 10, 2025' },
  { id: 'EMP-002', name: 'Anjali Sharma', role: 'Sales Executive', department: 'Sales', email: 'anjali.s@example.com', phone: '+91 98765 11112', status: 'Active', joinDate: 'Feb 15, 2025' },
  { id: 'EMP-003', name: 'Suresh Kumar', role: 'Warehouse Staff', department: 'Operations', email: 'suresh.k@example.com', phone: '+91 98765 11113', status: 'On Leave', joinDate: 'Mar 01, 2025' },
  { id: 'EMP-004', name: 'Megha Gupta', role: 'Cashier', department: 'Finance', email: 'megha.g@example.com', phone: '+91 98765 11114', status: 'Active', joinDate: 'Apr 20, 2025' },
  { id: 'EMP-005', name: 'Rahul Desai', role: 'Delivery Agent', department: 'Logistics', email: 'rahul.d@example.com', phone: '+91 98765 11115', status: 'Inactive', joinDate: 'Jun 05, 2025' },
];

export default function TeamMembersView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Name', accessorKey: 'name', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.name}</span>
        <span className="text-xs text-on-surface-variant">{row.email}</span>
      </div>
    )},
    { header: 'Role & Dept', accessorKey: 'role', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-on-surface">{row.role}</span>
        <span className="text-xs text-on-surface-variant">{row.department}</span>
      </div>
    )},
    { header: 'Phone', accessorKey: 'phone', cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.phone}</span> },
    { header: 'Join Date', accessorKey: 'joinDate', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.joinDate}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/team/${row.id}`}>
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Team Members</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage your employees, roles, and HR details.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/team/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </Link>
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
              placeholder="Search by name, role, or email..."
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
            data={teamList} 
          />
        </div>
      </div>
    </div>
  );
}
