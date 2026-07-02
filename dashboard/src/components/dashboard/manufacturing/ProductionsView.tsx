'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Factory, AlertCircle, CheckCircle2, TrendingUp, ChevronRight, Eye, Edit, Trash2, Activity, ClipboardList } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_PRODUCTIONS = [
  { id: 'PRD-1024', recipe: 'Premium Acoustic Foam', startDate: '2023-10-24', status: 'In Progress', expectedYield: 100, actualYield: null, cost: 12550 },
  { id: 'PRD-1023', recipe: 'Gaming Chair Base Mold', startDate: '2023-10-22', status: 'Completed', expectedYield: 50, actualYield: 48, cost: 42500 },
  { id: 'PRD-1022', recipe: 'Standard Desk Legs', startDate: '2023-10-20', status: 'Completed', expectedYield: 500, actualYield: 500, cost: 22600 },
  { id: 'PRD-1021', recipe: 'Premium Acoustic Foam', startDate: '2023-10-18', status: 'Failed', expectedYield: 100, actualYield: 12, cost: 12550 },
  { id: 'PRD-1020', recipe: 'RGB Light Strip 5M', startDate: '2023-10-15', status: 'Completed', expectedYield: 300, actualYield: 305, cost: 10500 },
];

export default function ProductionsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = MOCK_PRODUCTIONS.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.recipe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Run ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Recipe', accessorKey: 'recipe', cell: (row: any) => <span className="font-semibold text-primary">{row.recipe}</span> },
    { header: 'Start Date', accessorKey: 'startDate' },
    { header: 'Expected Yield', accessorKey: 'expectedYield', cell: (row: any) => `${row.expectedYield} Units` },
    { header: 'Actual Yield', accessorKey: 'actualYield', cell: (row: any) => row.actualYield ? (
      <span className={row.actualYield >= row.expectedYield ? "text-success font-bold" : "text-warning font-bold"}>
        {row.actualYield} Units
      </span>
    ) : <span className="text-on-surface-variant italic">Pending</span> },
    { header: 'Est. Cost', accessorKey: 'cost', cell: (row: any) => `₹${row.cost.toLocaleString()}` },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" />
        </Button>
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
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Production Runs</h2>
          <p className="text-sm font-medium text-on-surface-variant">Track manufacturing progress, yields, and associated costs.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export Log
          </Button>
          <Link href="/manufacturing/productions/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">New Production</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatsCard 
          title="Total Runs"
          value="1,248"
          icon={Factory}
          trend="+12"
          trendDirection="up"
          trendLabel="This Month"
          colorTheme="primary"
        />
        <StatsCard 
          title="Active Runs"
          value="4"
          icon={Activity}
          trendLabel="In Progress"
          colorTheme="blue"
        />
        <StatsCard 
          title="Success Rate"
          value="94.2%"
          icon={CheckCircle2}
          trendLabel="Completed vs Failed"
          colorTheme="success"
        />
        <StatsCard 
          title="Total Prod. Cost"
          value="₹8.4L"
          icon={ClipboardList}
          trendLabel="MTD Expense"
          colorTheme="yellow"
        />
      </div>

      {/* Productions Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search runs by ID or Recipe..."
          itemsPerPage={10}
          headerContent={
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Production Log</h3>
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
