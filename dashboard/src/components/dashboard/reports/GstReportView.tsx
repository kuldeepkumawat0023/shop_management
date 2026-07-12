'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsCard';
import { Download, Search, Receipt, ArrowUpRight, ArrowDownRight, Calculator, FileText, Calendar, MoreVertical } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-black text-on-surface tracking-tight">GST Report</h2>
          </div>
          <p className="text-sm font-medium text-on-surface-variant">Track your input tax credit and output GST liability.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-xl font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm h-11">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {gstKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Main Chart (Output GST vs ITC) */}
        <div className="md:col-span-8 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/20 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-lg font-black text-on-surface">Output GST vs ITC</h3>
            <button className="text-on-surface-variant hover:text-primary"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 min-h-[200px] w-full flex items-end justify-between px-4 pb-8 relative z-10">
            {/* Chart Graphic Placeholder */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs font-medium text-on-surface-variant pb-8">
              <span>₹50k</span><span>₹35k</span><span>₹20k</span><span>₹10k</span><span>₹0</span>
            </div>
            {/* Grid lines */}
            <div className="absolute left-10 right-0 top-0 h-full flex flex-col justify-between pb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full border-t border-outline-variant/20"></div>
              ))}
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            {/* Line chart abstract representation */}
            <div className="absolute left-10 right-0 top-10 bottom-8 rounded-t-xl opacity-80" 
                 style={{
                   background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.1) 0%, rgba(246, 248, 252, 0) 100%)',
                   borderBottom: '2px solid #0ea5e9'
                 }}>
              <div className="absolute bottom-0 left-[20%] w-3 h-3 bg-primary rounded-full" 
                   style={{boxShadow: '20px -20px 0 #0ea5e9, 40px -40px 0 #0ea5e9, 60px -30px 0 #0ea5e9, 80px -60px 0 #0ea5e9'}}></div>
            </div>
            {/* X-axis labels */}
            <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs font-medium text-on-surface-variant px-2">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </div>

        {/* Side Chart (GST by Tax Slab) */}
        <div className="md:col-span-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/20 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-on-surface">GST by Tax Slab</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative py-4">
            {/* Donut Chart Placeholder */}
            <div className="w-40 h-40 rounded-full border-[16px] border-surface-container relative">
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)'}}></div>
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-secondary" style={{clipPath: 'polygon(50% 50%, 0 100%, 0 0)', opacity: 0.8}}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-on-surface">18%</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Top Slab</span>
              </div>
            </div>
            {/* Legend */}
            <div className="mt-8 w-full space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span className="font-medium text-on-surface-variant">18% GST</span></div>
                <span className="font-bold text-on-surface">55%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div><span className="font-medium text-on-surface-variant">5% GST</span></div>
                <span className="font-bold text-on-surface">30%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-surface-container-highest"></div><span className="font-medium text-on-surface-variant">12% GST</span></div>
                <span className="font-bold text-on-surface">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col min-h-[400px] bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden mb-6">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface/50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select className="h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
              <option value="july_2026">July 2026</option>
              <option value="june_2026">June 2026</option>
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

      {/* Custom Report Generator */}
      <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/20">
        <h3 className="text-xl font-black text-on-surface border-b border-outline-variant/20 pb-4 mb-6">Custom Report Generator</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Report Type</label>
            <select className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
              <option>GSTR-1 (Sales)</option>
              <option>GSTR-2 (Purchases/ITC)</option>
              <option>GSTR-3B (Summary)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date Range</label>
            <div className="relative">
              <input 
                className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="Select dates..." 
                type="text" 
                defaultValue="Jul 1, 2026 - Jul 31, 2026"
              />
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            </div>
          </div>
          <div className="flex items-end gap-3 h-full pt-6 md:pt-0">
            <Button variant="outline" className="flex-1 bg-surface-container-lowest border-primary text-primary h-12 rounded-xl font-bold hover:bg-surface-container-low transition-colors shadow-sm" type="button">
              CSV
            </Button>
            <Button className="flex-[2] gradient-button text-white h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all border-none flex justify-center items-center gap-2" type="button">
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
