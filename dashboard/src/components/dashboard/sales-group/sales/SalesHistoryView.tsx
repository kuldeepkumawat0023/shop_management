'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Receipt, Users, Banknote, FileText, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { saleService } from '@/lib/services/sale.services';

// Dynamic KPIs will be calculated
const initialKPIs = [
  { title: "Total Revenue", value: "₹0", trend: "-", isPositive: true, icon: Banknote },
  { title: "Total Invoices", value: "0", trend: "-", isPositive: true, icon: Receipt },
  { title: "Pending Payments", value: "₹0", trend: "0 invoices", isPositive: false, icon: FileText },
  { title: "Avg Order Value", value: "₹0", trend: "-", isPositive: true, icon: Users },
];

export default function SalesHistoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [salesList, setSalesList] = useState<any[]>([]);
  const [kpis, setKpis] = useState(initialKPIs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await saleService.getSales();
        if (response.success) {
          const mapped = response.data.map((s: any) => ({
            id: s.invoiceNumber,
            date: new Date(s.saleDate).toLocaleDateString(),
            customer: s.customerId?.name || 'Walk-in Customer',
            status: s.paymentStatus,
            amount: s.netAmount,
            items: '-', // Not available directly in sale model unless populated/joined
            _id: s._id
          }));
          setSalesList(mapped);

          // Calculate Dynamic KPIs
          const totalRevenue = response.data.reduce((acc: number, s: any) => acc + (s.netAmount || 0), 0);
          const pendingSales = response.data.filter((s: any) => s.paymentStatus !== 'Paid');
          const pendingAmount = pendingSales.reduce((acc: number, s: any) => acc + (s.netAmount || 0), 0);
          const avgOrderValue = response.data.length ? totalRevenue / response.data.length : 0;

          setKpis([
            { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "Overall", isPositive: true, icon: Banknote },
            { title: "Total Invoices", value: `${response.data.length}`, trend: "All time", isPositive: true, icon: Receipt },
            { title: "Pending Payments", value: `₹${pendingAmount.toLocaleString()}`, trend: `From ${pendingSales.length} invoices`, isPositive: false, icon: FileText },
            { title: "Avg Order Value", value: `₹${Math.round(avgOrderValue).toLocaleString()}`, trend: "Per invoice", isPositive: true, icon: Users },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch sales', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredData = salesList.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading sales...</div>;

  const columns = [
    { header: 'Invoice No.', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Customer', accessorKey: 'customer', cell: (row: any) => <span className="font-semibold text-primary">{row.customer}</span> },
    { header: 'Items', accessorKey: 'items', cell: (row: any) => `${row.items} Items` },
    { header: 'Total Amount', accessorKey: 'amount', cell: (row: any) => <span className="font-bold">₹{row.amount.toLocaleString()}</span> },
    { header: 'Payment Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/sales/${row._id}`}>
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Sales History</h2>
          <p className="text-sm font-medium text-on-surface-variant">View all invoices, track payments, and manage customer orders.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Link href="/pos" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">New Sale</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {kpis.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Sales Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search by invoice no. or customer..."
          itemsPerPage={10}
          headerContent={
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">All Invoices</h3>
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
