'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Receipt, Users, Banknote, FileText, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { saleService } from '@/lib/services/sale.services';

// Note: KPI stats are currently static and can be made dynamic later
export default function SalesHistoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [salesList, setSalesList] = useState<any[]>([]);
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

  if (loading) return <div className="p-8">Loading sales... / बिक्री लोड हो रही है...</div>;

  const columns = [
    { header: 'Invoice No. / चालान संख्या', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Date / दिनांक', accessorKey: 'date' },
    { header: 'Customer / ग्राहक', accessorKey: 'customer', cell: (row: any) => <span className="font-semibold text-primary">{row.customer}</span> },
    { header: 'Items / आइटम', accessorKey: 'items', cell: (row: any) => `${row.items} Items / आइटम` },
    { header: 'Total Amount / कुल राशि', accessorKey: 'amount', cell: (row: any) => <span className="font-bold">₹{row.amount.toLocaleString()}</span> },
    { header: 'Payment Status / भुगतान की स्थिति', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions / कार्रवाइयाँ', accessorKey: 'actions', cell: (row: any) => (
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Sales History / बिक्री इतिहास</h2>
          <p className="text-sm font-medium text-on-surface-variant">View all invoices, track payments, and manage customer orders. / सभी चालान देखें, भुगतान ट्रैक करें और ग्राहक आदेश प्रबंधित करें।</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export / निर्यात</span>
          </Button>
          <Link href="/pos" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">New Sale / नई बिक्री</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatsCard 
          title="Total Revenue"
          value="₹4.2L"
          icon={Banknote}
          trend="+15%"
          trendDirection="up"
          trendLabel="vs last month"
          colorTheme="primary"
        />
        <StatsCard 
          title="Total Invoices"
          value="1,245"
          icon={Receipt}
          trend="+42"
          trendDirection="up"
          trendLabel="This Month"
          colorTheme="success"
        />
        <StatsCard 
          title="Pending Payments"
          value="₹84,500"
          icon={FileText}
          trendLabel="From 18 invoices"
          colorTheme="warning"
        />
        <StatsCard 
          title="Avg Order Value"
          value="₹3,450"
          icon={Users}
          trend="+5%"
          trendDirection="up"
          trendLabel="vs last month"
          colorTheme="purple"
        />
      </div>

      {/* Sales Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search by invoice no. or customer... / चालान संख्या या ग्राहक द्वारा खोजें..."
          itemsPerPage={10}
          headerContent={
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">All Invoices / सभी चालान</h3>
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
