'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsCard';
import { Download, Search, Receipt, ArrowUpRight, ArrowDownRight, Calculator, FileText, Calendar, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Mock Data
const gstList = [
  { id: 'INV-2026-001', date: 'Jul 24, 2026', type: 'Sales', party: 'Walk-in Customer', taxable: 15000, cgst: 1350, sgst: 1350, igst: 0, totalGst: 2700 },
  { id: 'PO-2026-041', date: 'Jul 22, 2026', type: 'Purchase', party: 'Global Traders', taxable: 40000, cgst: 3600, sgst: 3600, igst: 0, totalGst: 7200 },
  { id: 'INV-2026-002', date: 'Jul 20, 2026', type: 'Sales', party: 'TechCorp Solutions', taxable: 85000, cgst: 0, sgst: 0, igst: 15300, totalGst: 15300 },
  { id: 'PO-2026-042', date: 'Jul 15, 2026', type: 'Purchase', party: 'Local Suppliers', taxable: 12000, cgst: 1080, sgst: 1080, igst: 0, totalGst: 2160 },
  { id: 'INV-2026-003', date: 'Jul 10, 2026', type: 'Sales', party: 'Walk-in Customer', taxable: 5000, cgst: 450, sgst: 450, igst: 0, totalGst: 900 },
];

export default function GstReportView() {
  const { t } = useTranslation();
  const gstKPIs = [
    { title: t('finance.gstReportView.totalOutputGst'), value: "₹45,200", trend: t('finance.gstReportView.collectedOnSales'), isPositive: true, icon: ArrowUpRight },
    { title: t('finance.gstReportView.totalItc'), value: "₹12,400", trend: t('finance.gstReportView.paidOnPurchases'), isPositive: true, icon: ArrowDownRight },
    { title: t('finance.gstReportView.netGstPayable'), value: "₹32,800", trend: t('finance.gstReportView.outputMinusItc'), isPositive: false, icon: Calculator },
  ];
  const { t } = useTranslation();
  const columns = [
    { header: t('finance.gstReportView.date'), accessorKey: 'date', cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.date}</span> },
    { header: t('finance.gstReportView.docNo'), accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: t('finance.gstReportView.type'), accessorKey: 'type', cell: (row: any) => (
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${row.type === 'Sales' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
        {row.type}
      </span>
    )},
    { header: t('finance.gstReportView.partyName'), accessorKey: 'party', cell: (row: any) => <span className="font-semibold text-on-surface">{row.party}</span> },
    { header: t('finance.gstReportView.taxableVal'), accessorKey: 'taxable', cell: (row: any) => <span className="font-medium text-on-surface">₹{row.taxable.toLocaleString()}</span> },
    { header: t('finance.gstReportView.cgst'), accessorKey: 'cgst', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{row.cgst.toLocaleString()}</span> },
    { header: t('finance.gstReportView.sgst'), accessorKey: 'sgst', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{row.sgst.toLocaleString()}</span> },
    { header: t('finance.gstReportView.igst'), accessorKey: 'igst', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{row.igst.toLocaleString()}</span> },
    { header: t('finance.gstReportView.totalGst'), accessorKey: 'totalGst', cell: (row: any) => <span className={`font-black ${row.type === 'Sales' ? 'text-error' : 'text-success'}`}>₹{row.totalGst.toLocaleString()}</span> },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-black text-on-surface tracking-tight">{t('finance.gstReportView.gstReport')}</h2>
          </div>
          <p className="text-sm font-medium text-on-surface-variant">{t('finance.gstReportView.trackGst')}</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-xl font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm h-11">
            <Calendar className="w-4 h-4" />
            {t('finance.gstReportView.last30Days')}
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
            <h3 className="text-lg font-black text-on-surface">{t('finance.gstReportView.outputVsItc')}</h3>
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
            <h3 className="text-lg font-black text-on-surface">{t('finance.gstReportView.gstByTaxSlab')}</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative py-4">
            {/* Donut Chart Placeholder */}
            <div className="w-40 h-40 rounded-full border-[16px] border-surface-container relative">
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)'}}></div>
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-secondary" style={{clipPath: 'polygon(50% 50%, 0 100%, 0 0)', opacity: 0.8}}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-on-surface">18%</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t('finance.gstReportView.topSlab')}</span>
              </div>
            </div>
            {/* Legend */}
            <div className="mt-8 w-full space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span className="font-medium text-on-surface-variant">{t('finance.gstReportView.gst18')}</span></div>
                <span className="font-bold text-on-surface">55%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div><span className="font-medium text-on-surface-variant">{t('finance.gstReportView.gst5')}</span></div>
                <span className="font-bold text-on-surface">30%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-surface-container-highest"></div><span className="font-medium text-on-surface-variant">{t('finance.gstReportView.gst12')}</span></div>
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
              <option value="july_2026">{t('finance.gstReportView.july2026')}</option>
              <option value="june_2026">{t('finance.gstReportView.june2026')}</option>
            </select>
            
            <select className="h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
              <option value="all">{t('finance.gstReportView.allTypes')}</option>
              <option value="sales">{t('finance.gstReportView.salesOutput')}</option>
              <option value="purchases">{t('finance.gstReportView.purchasesItc')}</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text"
                placeholder={t('finance.gstReportView.searchPlaceholder')}
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
        <h3 className="text-xl font-black text-on-surface border-b border-outline-variant/20 pb-4 mb-6">{t('finance.gstReportView.customReportGen')}</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('finance.gstReportView.reportType')}</label>
            <select className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
              <option>{t('finance.gstReportView.gstr1')}</option>
              <option>{t('finance.gstReportView.gstr2')}</option>
              <option>{t('finance.gstReportView.gstr3b')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('finance.gstReportView.dateRange')}</label>
            <div className="relative">
              <input 
                className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder={t('finance.gstReportView.selectDates')} 
                type="text" 
                defaultValue="Jul 1, 2026 - Jul 31, 2026"
              />
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            </div>
          </div>
          <div className="flex items-end gap-3 h-full pt-6 md:pt-0">
            <Button variant="outline" className="flex-1 bg-surface-container-lowest border-primary text-primary h-12 rounded-xl font-bold hover:bg-surface-container-low transition-colors shadow-sm" type="button">
              {t('finance.gstReportView.csv')}
            </Button>
            <Button className="flex-[2] gradient-button text-white h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all border-none flex justify-center items-center gap-2" type="button">
              <Download className="w-5 h-5" />
              {t('finance.gstReportView.downloadPdf')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
