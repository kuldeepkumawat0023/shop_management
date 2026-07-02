'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsCard';
import { Download, Filter, Search, Receipt, ArrowUpRight, ArrowDownRight, Calculator, FileText } from 'lucide-react';

// Mock Data
const gstKPIs = [
  { title: "Total Output GST", value: "₹45,200", trend: "Collected on Sales", isPositive: true, icon: ArrowUpRight },
  { title: "Total ITC", value: "₹12,400", trend: "Paid on Purchases", isPositive: true, icon: ArrowDownRight },
  { title: "Net GST Payable", value: "₹32,800", trend: "Output - ITC", isPositive: false, icon: Calculator },
];

const gstList = [
  { id: 'INV-2026-001', date: 'Jul 24, 2026', type: 'Sales', party: 'Walk-in Customer', taxable: 15000, cgst: 1350, sgst: 1350, igst: 0, totalGst: 2700 },
  { id: 'PO-2026-041', date: 'Jul 22, 2026', type: 'Purchase', party: 'Global Traders', taxable: 40000, cgst: 3600, sgst: 3600, igst: 0, totalGst: 7200 },
  { id: 'INV-2026-002', date: 'Jul 20, 2026', type: 'Sales', party: 'TechCorp Solutions', taxable: 85000, cgst: 0, sgst: 0, igst: 15300, totalGst: 15300 },
  { id: 'PO-2026-042', date: 'Jul 15, 2026', type: 'Purchase', party: 'Local Suppliers', taxable: 12000, cgst: 1080, sgst: 1080, igst: 0, totalGst: 2160 },
  { id: 'INV-2026-003', date: 'Jul 10, 2026', type: 'Sales', party: 'Walk-in Customer', taxable: 5000, cgst: 450, sgst: 450, igst: 0, totalGst: 900 },
];

export default function GstReportView() {
  const columns = [
    { header: 'Date', accessorKey: 'date', cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.date}</span> },
    { header: 'Doc No.', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Type', accessorKey: 'type', cell: (row: any) => (
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${row.type === 'Sales' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
        {row.type}
      </span>
    )},
    { header: 'Party Name', accessorKey: 'party', cell: (row: any) => <span className="font-semibold text-on-surface">{row.party}</span> },
    { header: 'Taxable Val', accessorKey: 'taxable', cell: (row: any) => <span className="font-medium text-on-surface">₹{row.taxable.toLocaleString()}</span> },
    { header: 'CGST', accessorKey: 'cgst', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{row.cgst.toLocaleString()}</span> },
    { header: 'SGST', accessorKey: 'sgst', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{row.sgst.toLocaleString()}</span> },
    { header: 'IGST', accessorKey: 'igst', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{row.igst.toLocaleString()}</span> },
    { header: 'Total GST', accessorKey: 'totalGst', cell: (row: any) => <span className={`font-black ${row.type === 'Sales' ? 'text-error' : 'text-success'}`}>₹{row.totalGst.toLocaleString()}</span> },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-black text-on-surface tracking-tight">GST Report</h2>
          </div>
          <p className="text-sm font-medium text-on-surface-variant">Track your input tax credit and output GST liability.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <FileText className="w-4 h-4" />
            Export to Excel
          </Button>
          <Button className="flex-1 md:flex-none gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {gstKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select className="h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
              <option value="july_2026">July 2026</option>
              <option value="june_2026">June 2026</option>
              <option value="may_2026">May 2026</option>
            </select>
            
            <select className="h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
              <option value="all">All Types</option>
              <option value="sales">Sales (Output)</option>
              <option value="purchases">Purchases (ITC)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search by Doc No or Party..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <DataTable 
            columns={columns} 
            data={gstList} 
          />
        </div>
      </div>
    </div>
  );
}
