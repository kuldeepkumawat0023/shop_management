'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsCard';
import { Download, TrendingUp, IndianRupee, PieChart as PieIcon, Activity, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// ponytail: mock data — no backend report endpoint needed yet
const MONTHLY_DATA = [
  { month: 'Feb', revenue: 320000, expenses: 210000 },
  { month: 'Mar', revenue: 380000, expenses: 240000 },
  { month: 'Apr', revenue: 290000, expenses: 195000 },
  { month: 'May', revenue: 410000, expenses: 260000 },
  { month: 'Jun', revenue: 395000, expenses: 250000 },
  { month: 'Jul', revenue: 450000, expenses: 280000 },
];

const EXPENSE_BREAKDOWN = [
  { name: 'COGS', value: 180000, color: '#f59e0b' },
  { name: 'Payroll', value: 75000,  color: '#6366f1' },
  { name: 'Rent',    value: 15000,  color: '#ec4899' },
  { name: 'Marketing', value: 5000, color: '#14b8a6' },
  { name: 'Misc',    value: 5000,   color: '#94a3b8' },
];

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 shadow-xl text-xs">
      <p className="font-black text-on-surface mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-on-surface-variant font-medium">{p.name}:</span>
          <span className="font-bold text-on-surface">₹{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3 shadow-xl text-xs">
      <p className="font-bold text-on-surface">{payload[0].name}</p>
      <p className="text-primary font-black">₹{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function ProfitReportView() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('this_month');

  const pnlKPIs = [
    { title: t('finance.profitReportView.totalRevenue'),  value: '₹4,50,000', trend: t('finance.profitReportView.july2026'),    isPositive: true,  icon: TrendingUp },
    { title: t('finance.profitReportView.totalExpenses'), value: '₹2,80,000', trend: t('finance.profitReportView.cogsOperating'), isPositive: false, icon: PieIcon },
    { title: t('finance.profitReportView.netProfit'),     value: '₹1,70,000', trend: t('finance.profitReportView.vsLastMonth'),  isPositive: true,  icon: IndianRupee },
    { title: t('finance.profitReportView.profitMargin'),  value: '37.7%',     trend: t('finance.profitReportView.healthy'),      isPositive: true,  icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-black text-on-surface tracking-tight">{t('finance.profitReportView.profitAndLoss')}</h2>
          </div>
          <p className="text-sm font-medium text-on-surface-variant">{t('finance.profitReportView.analyzeMsg')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[140px]"
          >
            <option value="this_month">{t('finance.profitReportView.thisMonth')}</option>
            <option value="last_month">{t('finance.profitReportView.lastMonth')}</option>
            <option value="this_quarter">{t('finance.profitReportView.thisQuarter')}</option>
            <option value="this_year">{t('finance.profitReportView.thisYear')}</option>
          </select>
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <FileText className="w-4 h-4" />
            {t('finance.profitReportView.exportExcel')}
          </Button>
          <Button className="flex-1 md:flex-none gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
            <Download className="w-4 h-4" />
            {t('finance.profitReportView.downloadPdf')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {pnlKPIs.map((kpi, idx) => <StatsCard key={idx} {...kpi} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Bar Chart — Revenue vs Expenses */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-base font-black text-on-surface">Revenue vs Expenses</h3>
            <p className="text-xs text-on-surface-variant font-medium">Last 6 months trend</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MONTHLY_DATA} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} width={42} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-container)', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--color-error)" radius={[6, 6, 0, 0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart — Expense Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-black text-on-surface">Expense Breakdown</h3>
            <p className="text-xs text-on-surface-variant font-medium">By category</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={EXPENSE_BREAKDOWN} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value">
                  {EXPENSE_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {EXPENSE_BREAKDOWN.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="font-semibold text-on-surface-variant">{e.name}</span>
                </div>
                <span className="font-bold text-on-surface">₹{e.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 bg-surface-container-lowest/50 border-b border-outline-variant/20 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-black text-on-surface uppercase tracking-widest">{t('finance.profitReportView.incomeStatement')}</h3>
          <p className="text-sm font-medium text-on-surface-variant">{t('finance.profitReportView.periodEnding')}</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-8">

          {/* Revenue */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-black text-primary uppercase tracking-wider border-b border-outline-variant/20 pb-2 mb-2">{t('finance.profitReportView.revenue')}</h4>
            <div className="flex justify-between items-center py-2 px-4 hover:bg-surface rounded-lg transition-colors">
              <span className="font-semibold text-on-surface">{t('finance.profitReportView.salesRevenue')}</span>
              <span className="font-bold text-on-surface">₹4,45,000</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 hover:bg-surface rounded-lg transition-colors">
              <span className="font-semibold text-on-surface">{t('finance.profitReportView.otherIncome')}</span>
              <span className="font-bold text-on-surface">₹5,000</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-primary/5 rounded-xl mt-2 border border-primary/10">
              <span className="font-black text-on-surface uppercase text-sm">{t('finance.profitReportView.totalRevenueA')}</span>
              <span className="font-black text-primary text-lg">₹4,50,000</span>
            </div>
          </div>

          {/* COGS */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-black text-warning uppercase tracking-wider border-b border-outline-variant/20 pb-2 mb-2">{t('finance.profitReportView.cogs')}</h4>
            <div className="flex justify-between items-center py-2 px-4 hover:bg-surface rounded-lg transition-colors">
              <span className="font-medium text-on-surface-variant">{t('finance.profitReportView.openingStock')}</span>
              <span className="font-medium text-on-surface-variant">₹1,50,000</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 hover:bg-surface rounded-lg transition-colors">
              <span className="font-semibold text-on-surface">{t('finance.profitReportView.addPurchases')}</span>
              <span className="font-bold text-on-surface">₹1,00,000</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 hover:bg-surface rounded-lg transition-colors">
              <span className="font-medium text-on-surface-variant">{t('finance.profitReportView.lessClosingStock')}</span>
              <span className="font-medium text-on-surface-variant">(₹70,000)</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-warning/5 rounded-xl mt-2 border border-warning/10">
              <span className="font-black text-on-surface uppercase text-sm">{t('finance.profitReportView.totalCogsB')}</span>
              <span className="font-black text-warning text-lg">₹1,80,000</span>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="flex justify-between items-center py-4 px-6 bg-surface-container rounded-2xl border border-outline-variant/20 shadow-sm">
            <span className="font-black text-on-surface uppercase tracking-widest text-sm">{t('finance.profitReportView.grossProfit')}</span>
            <span className="font-black text-on-surface text-2xl">₹2,70,000</span>
          </div>

          {/* Operating Expenses */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-black text-error uppercase tracking-wider border-b border-outline-variant/20 pb-2 mb-2">{t('finance.profitReportView.operatingExpenses')}</h4>
            {[
              [t('finance.profitReportView.payrollSalaries'), '₹75,000'],
              [t('finance.profitReportView.rentUtilities'),   '₹15,000'],
              [t('finance.profitReportView.marketingAds'),    '₹5,000'],
              [t('finance.profitReportView.miscellaneous'),   '₹5,000'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-2 px-4 hover:bg-surface rounded-lg transition-colors">
                <span className="font-semibold text-on-surface">{label}</span>
                <span className="font-bold text-on-surface">{val}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 px-4 bg-error/5 rounded-xl mt-2 border border-error/10">
              <span className="font-black text-on-surface uppercase text-sm">{t('finance.profitReportView.totalExpensesC')}</span>
              <span className="font-black text-error text-lg">₹1,00,000</span>
            </div>
          </div>

          {/* Net Profit Banner */}
          <div className="flex justify-between items-center py-6 px-8 bg-gradient-to-r from-primary to-primary-container rounded-3xl shadow-lg border border-primary/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
            <div className="flex flex-col relative z-10">
              <span className="font-black uppercase tracking-widest text-sm text-white/80">{t('finance.profitReportView.netProfit')}</span>
              <span className="text-sm font-bold text-white/90 mt-1">{t('finance.profitReportView.netProfitMsg')}</span>
            </div>
            <span className="font-black text-4xl relative z-10 drop-shadow-md">₹1,70,000</span>
          </div>

        </div>
      </div>
    </div>
  );
}
