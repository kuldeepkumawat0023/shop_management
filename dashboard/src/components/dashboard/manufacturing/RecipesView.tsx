'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, BookOpen, Activity, Beaker, FileText, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_RECIPES = [
  { id: 'REC-001', name: 'Premium Acoustic Foam', outputProduct: 'SoundPanel Pro 2x2', baseCost: 125.50, ingredientsCount: 4, expectedYield: 100, status: 'Active' },
  { id: 'REC-002', name: 'Gaming Chair Base Mold', outputProduct: 'ErgoSeat Base', baseCost: 850.00, ingredientsCount: 8, expectedYield: 50, status: 'Active' },
  { id: 'REC-003', name: 'Standard Desk Legs', outputProduct: 'Metal Leg Set A', baseCost: 45.20, ingredientsCount: 2, expectedYield: 500, status: 'Active' },
  { id: 'REC-004', name: 'Bluetooth Earbud Shell', outputProduct: 'SonicBuds Casing', baseCost: 12.80, ingredientsCount: 3, expectedYield: 2000, status: 'Archived' },
  { id: 'REC-005', name: 'RGB Light Strip 5M', outputProduct: 'GamerGlow 5M', baseCost: 35.00, ingredientsCount: 5, expectedYield: 300, status: 'Active' },
];

export default function RecipesView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = MOCK_RECIPES.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.outputProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Recipe ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Recipe Name', accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-primary">{row.name}</span> },
    { header: 'Output Product', accessorKey: 'outputProduct' },
    { header: 'Ingredients', accessorKey: 'ingredientsCount', cell: (row: any) => `${row.ingredientsCount} Items` },
    { header: 'Base Cost', accessorKey: 'baseCost', cell: (row: any) => `₹${row.baseCost.toFixed(2)}` },
    { header: 'Expected Yield', accessorKey: 'expectedYield', cell: (row: any) => <span className="font-medium text-on-surface">{row.expectedYield} Units</span> },
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
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Manufacturing Recipes</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage formulas, bills of materials (BOM), and expected yields.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/manufacturing/recipes/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Add Recipe</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatsCard 
          title="Total Recipes"
          value="142"
          icon={BookOpen}
          trend="+5"
          trendDirection="up"
          trendLabel="This Month"
          colorTheme="primary"
        />
        <StatsCard 
          title="Active Formulas"
          value="118"
          icon={Activity}
          trendLabel="83% Active Rate"
          colorTheme="success"
        />
        <StatsCard 
          title="Avg Base Cost"
          value="₹345.50"
          icon={FileText}
          trendLabel="Per Unit Yield"
          colorTheme="yellow"
        />
        <StatsCard 
          title="Most Used Recipe"
          value="Metal Leg Set"
          icon={Beaker}
          trendLabel="15 Runs this month"
          colorTheme="purple"
        />
      </div>

      {/* Recipes Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden">
        <DataTable 
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search recipes by name or ID..."
          itemsPerPage={10}
          headerContent={
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Recipe Master List</h3>
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
