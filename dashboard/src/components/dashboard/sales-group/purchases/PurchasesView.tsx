'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, ShoppingCart, Truck, Wallet, FileText, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_PURCHASES = [
  { id: 'PO-2023-001', date: '2023-10-24', supplier: 'TechParts Pvt Ltd', status: 'Paid', delivery: 'Delivered', amount: 145000 },
  { id: 'PO-2023-002', date: '2023-10-23', supplier: 'Global Supplies', status: 'Pending', delivery: 'In Transit', amount: 22500 },
  { id: 'PO-2023-003', date: '2023-10-22', supplier: 'Apex Furniture Co', status: 'Partial', delivery: 'Pending', amount: 84000 },
  { id: 'PO-2023-004', date: '2023-10-20', supplier: 'TechParts Pvt Ltd', status: 'Paid', delivery: 'Delivered', amount: 45000 },
  { id: 'PO-2023-005', date: '2023-10-18', supplier: 'Nexus Electronics', status: 'Overdue', delivery: 'Delivered', amount: 112000 },
];

export default function PurchasesView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = MOCK_PURCHASES.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'PO Number', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Supplier', accessorKey: 'supplier', cell: (row: any) => <span className="font-semibold text-primary">{row.supplier}</span> },
    { header: 'Payment Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Delivery', accessorKey: 'delivery', cell: (row: any) => (
      <span className={`font-semibold ${row.delivery === 'Delivered' ? 'text-success' : row.delivery === 'In Transit' ? 'text-blue' : 'text-warning'}`}>
        {row.delivery}
      </span>
    )},
    { header: 'Total Amount', accessorKey: 'amount', cell: (row: any) => <span className="font-bold">₹{row.amount.toLocaleString()}</span> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/purchases/${row.id}`}>
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Purchases</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage purchase orders, supplier bills, and inventory restocking.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/purchases/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">New Purchase</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatsCard 
          title="Total Purchases"
          value="₹3.8L"
          icon={ShoppingCart}
          trend="+12%"
          trendDirection="up"
          trendLabel="vs last month"
          colorTheme="primary"
        />
        <StatsCard 
          title="Pending Payments"
          value="₹1.2L"
          icon={Wallet}
          trendLabel="Across 8 bills"
          colorTheme="warning"
        />
        <StatsCard 
          title="Active Orders"
          value="12"
          icon={Truck}
          trendLabel="Awaiting Delivery"
          colorTheme="blue"
        />
        <StatsCard 
          title="Top Supplier"
          value="TechParts"
          icon={FileText}
          trendLabel="45% of PO volume"
          colorTheme="purple"
        />
      </div>

      {/* Purchases Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search by PO number or supplier..."
          itemsPerPage={10}
          headerContent={
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Purchase Orders</h3>
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
