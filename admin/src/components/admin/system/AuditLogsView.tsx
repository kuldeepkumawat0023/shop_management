'use client';

import React, { useState } from 'react';
import { ListOrdered, Search, Filter, ShieldAlert, Key, Store, User, Database } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';

const mockLogs = [
  { id: 'log_01', date: 'Oct 24, 2026, 11:30 AM', user: 'Kuldeep Kumawat', action: 'Triggered Manual Backup', module: 'System', ip: '192.168.1.45', risk: 'Low' },
  { id: 'log_02', date: 'Oct 24, 2026, 10:15 AM', user: 'Amit Singh', action: 'Assigned to SHP-042', module: 'Team', ip: '10.0.0.12', risk: 'Low' },
  { id: 'log_03', date: 'Oct 23, 2026, 09:45 PM', user: 'System', action: 'Failed Login (root)', module: 'Security', ip: '45.33.22.11', risk: 'High' },
  { id: 'log_04', date: 'Oct 23, 2026, 04:20 PM', user: 'Ravi Tech Support', action: 'Suspended SHP-018', module: 'Branches', ip: '192.168.1.104', risk: 'Medium' },
  { id: 'log_05', date: 'Oct 22, 2026, 11:00 AM', user: 'Kuldeep Kumawat', action: 'Revoked Access (Priya CS)', module: 'Team', ip: '192.168.1.45', risk: 'High' },
  { id: 'log_06', date: 'Oct 22, 2026, 08:30 AM', user: 'System', action: 'Automated Backup Success', module: 'System', ip: 'localhost', risk: 'Low' },
];

export default function AuditLogsView() {
  const [search, setSearch] = useState('');

  const filteredLogs = mockLogs.filter(log => 
    log.user.toLowerCase().includes(search.toLowerCase()) || 
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  const getModuleIcon = (moduleName: string) => {
    switch(moduleName) {
      case 'System': return <Database className="w-4 h-4 text-primary" />;
      case 'Team': return <User className="w-4 h-4 text-secondary" />;
      case 'Security': return <ShieldAlert className="w-4 h-4 text-error" />;
      case 'Branches': return <Store className="w-4 h-4 text-warning" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      accessorKey: 'date',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{row.date}</span>
      )
    },
    {
      header: 'User / Agent',
      accessorKey: 'user',
      cell: (row: any) => (
        <span className="text-sm font-bold text-on-surface">{row.user}</span>
      )
    },
    {
      header: 'Module',
      accessorKey: 'module',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          {getModuleIcon(row.module)}
          <span className="text-sm font-medium text-on-surface-variant">{row.module}</span>
        </div>
      )
    },
    {
      header: 'Action Taken',
      accessorKey: 'action',
      cell: (row: any) => (
        <span className="text-sm font-bold text-on-surface">{row.action}</span>
      )
    },
    {
      header: 'IP Address',
      accessorKey: 'ip',
      cell: (row: any) => (
        <span className="text-xs font-mono font-medium bg-surface-container px-2 py-1 rounded text-on-surface-variant border border-outline-variant/20">{row.ip}</span>
      )
    },
    {
      header: 'Risk',
      accessorKey: 'risk',
      cell: (row: any) => {
        const colors = {
          Low: 'bg-success/10 text-success border-success/20',
          Medium: 'bg-warning/10 text-warning border-warning/20',
          High: 'bg-error/10 text-error border-error/20'
        };
        const colorClass = colors[row.risk as keyof typeof colors] || colors.Low;
        return (
          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>
            {row.risk}
          </span>
        );
      }
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight flex items-center gap-2">
            <ListOrdered className="w-8 h-8 text-primary" />
            Audit Logs
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Immutable record of all administrative and system actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-on-surface-variant gap-2 border-outline-variant/30">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col mb-6">
        <DataTable
          data={filteredLogs}
          columns={columns}
          headerContent={
            <div className="flex items-center w-full max-w-sm relative">
              <Search className="w-4 h-4 absolute left-3 text-on-surface-variant" />
              <Input 
                placeholder="Search logs by user or action..." 
                className="pl-9 w-full bg-surface-container-low border-outline-variant/20 focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          }
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent"
        />
      </div>

    </div>
  );
}
