'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { Plus, Download, ShoppingCart, Truck, Wallet, FileText, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { purchaseService } from '@/lib/services/purchase.services';
import { useTranslation } from 'react-i18next';

// Dynamic KPIs will be calculated
const getInitialKPIs = (t: any) => [
  { title: t('purchases.purchasesView.totalPurchases'), value: "₹0", trend: "-", isPositive: true, icon: ShoppingCart },
  { title: t('purchases.purchasesView.pendingPayments'), value: "₹0", trend: `0 ${t('purchases.purchasesView.bills')}`, isPositive: false, icon: Wallet },
  { title: t('purchases.purchasesView.activeOrders'), value: "0", trend: "-", isPositive: true, icon: Truck },
  { title: t('purchases.purchasesView.topSupplier'), value: "-", trend: "-", isPositive: true, icon: FileText },
];

export default function PurchasesView() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasesList, setPurchasesList] = useState<any[]>([]);
  const [kpis, setKpis] = useState(() => getInitialKPIs(t));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await purchaseService.getPurchases();
        if (response.success) {
          const mapped = response.data.map((p: any) => ({
            id: p.invoiceNumber,
            date: new Date(p.purchaseDate).toLocaleDateString(),
            supplier: p.supplierId?.name || t('purchases.purchasesView.unknownSupplier'),
            status: p.paymentStatus,
            delivery: t('purchases.purchasesView.delivered'), // placeholder as delivery status isn't in model
            amount: p.totalAmount,
            _id: p._id
          }));
          setPurchasesList(mapped);

          // Calculate Dynamic KPIs
          const totalAmount = response.data.reduce((acc: number, p: any) => acc + (p.totalAmount || 0), 0);
          const pendingBills = response.data.filter((p: any) => p.paymentStatus !== 'Paid');
          const pendingAmount = pendingBills.reduce((acc: number, p: any) => acc + (p.totalAmount || 0), 0);
          
          const supplierCounts: Record<string, number> = {};
          response.data.forEach((p: any) => {
            const name = p.supplierId?.name || t('purchases.purchasesView.unknown');
            supplierCounts[name] = (supplierCounts[name] || 0) + (p.totalAmount || 0);
          });
          const topSupplier = Object.entries(supplierCounts).sort((a, b) => b[1] - a[1])[0];

          setKpis([
            { title: t('purchases.purchasesView.totalPurchases'), value: `₹${totalAmount.toLocaleString()}`, trend: t('purchases.purchasesView.overall'), isPositive: true, icon: ShoppingCart },
            { title: t('purchases.purchasesView.pendingPayments'), value: `₹${pendingAmount.toLocaleString()}`, trend: `${pendingBills.length} ${t('purchases.purchasesView.bills')}`, isPositive: false, icon: Wallet },
            { title: t('purchases.purchasesView.activeOrders'), value: `${response.data.length}`, trend: t('purchases.purchasesView.totalOrders'), isPositive: true, icon: Truck },
            { title: t('purchases.purchasesView.topSupplier'), value: topSupplier ? topSupplier[0] : "-", trend: topSupplier ? `₹${topSupplier[1].toLocaleString()}` : "-", isPositive: true, icon: FileText },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch purchases', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const filteredData = purchasesList.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <ViewPageSkeleton />;

  const columns = [
    { header: t('purchases.purchasesView.poNumber'), accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: t('purchases.purchasesView.date'), accessorKey: 'date' },
    { header: t('purchases.purchasesView.supplier'), accessorKey: 'supplier', cell: (row: any) => <span className="font-semibold text-primary">{row.supplier}</span> },
    { header: t('purchases.purchasesView.paymentStatus'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: t('purchases.purchasesView.delivery'), accessorKey: 'delivery', cell: (row: any) => (
      <span className={`font-semibold ${row.delivery === t('purchases.purchasesView.delivered') ? 'text-success' : row.delivery === 'In Transit' ? 'text-blue' : 'text-warning'}`}>
        {row.delivery}
      </span>
    )},
    { header: t('purchases.purchasesView.totalAmount'), accessorKey: 'amount', cell: (row: any) => <span className="font-bold">₹{row.amount.toLocaleString()}</span> },
    { header: t('purchases.purchasesView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/purchases/${row._id}`}>
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('purchases.purchasesView.purchases')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('purchases.purchasesView.managePurchases')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('purchases.purchasesView.export')}</span>
          </Button>
          <Link href="/purchases/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('purchases.purchasesView.newPurchase')}</span>
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

      {/* Purchases Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          searchPlaceholder={t('purchases.purchasesView.searchPlaceholder')}
          itemsPerPage={10}
          headerContent={
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">{t('purchases.purchasesView.purchaseOrders')}</h3>
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
