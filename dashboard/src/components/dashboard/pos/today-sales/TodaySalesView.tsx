'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Printer, Eye, TrendingUp, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { saleService } from '@/lib/services/sale.services';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import InvoiceModal from './InvoiceModal';
import { DeleteModal } from '@/components/common/DeleteModal';
import { useRouter } from 'next/navigation';
import { usePOS } from '@/contexts/POSContext';
import { useTranslation } from 'react-i18next';

export default function TodaySalesView() {
  const router = useRouter();
  const { setCart, setDiscount, setTax, setEditSaleId } = usePOS();
  const { t } = useTranslation();

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await saleService.getSales();
      if (res.success) {
        // In a real app, we'd filter for "today" on backend, for now we just use all sales for the view
        setSales(res.data);
      }
    } catch (error) {
      toast.error(t('pos.todaySales.failedToLoadSales'), { id: 'failed-to-load-sales----------' });
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (sale: any) => {
    const toastId = toast.loading(t('pos.todaySales.loadingInvoice'));
    try {
      const res = await saleService.getSaleById(sale._id);
      if (res.success) {
        setSelectedSale(res.data.sale);
        setSaleItems(res.data.items);
        setIsModalOpen(true);
        toast.dismiss(toastId);
      }
    } catch (error) {
      toast.error(t('pos.todaySales.failedToLoadSaleData'), { id: toastId });
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, invoiceNumber: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;

    const toastId = toast.loading(t('pos.todaySales.deletingSale'));
    try {
      const res = await saleService.deleteSale(deleteTarget.id);
      if (res.success) {
        toast.success(t('pos.todaySales.saleDeleted'), { id: toastId });
        setSales(sales.filter(s => s._id !== deleteTarget.id));
      }
    } catch (error) {
      toast.error(t('pos.todaySales.deleteSaleFailed'), { id: toastId });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, invoiceNumber: string) => {
    setDeleteTarget({ id, invoiceNumber });
  };

  const handleEdit = async (sale: any) => {
    const toastId = toast.loading(t('pos.todaySales.loadingSaleForEdit'));
    try {
      const res = await saleService.getSaleById(sale._id);
      if (res.success) {
        const { sale: fullSale, items } = res.data;
        const cartItems = items.map((item: any) => ({
          productId: item.productId._id,
          name: item.productId.name,
          sellingPrice: item.sellingPrice,
          quantity: item.quantity,
          stock: item.productId.currentStock + item.quantity
        }));

        setCart(cartItems);
        setDiscount(fullSale.discountAmount || 0);
        setTax(fullSale.taxAmount || 0);
        setEditSaleId(fullSale._id);

        toast.dismiss(toastId);
        router.push('/pos'); // Go back to POS terminal
      }
    } catch (error) {
      toast.error(t('pos.todaySales.failedToLoadSaleData'), { id: toastId });
    }
  };
  const columns = [
    {
      header: t('pos.todaySales.invoiceId'),
      accessorKey: 'invoiceNumber',
      cell: (row: any) => (
        <span className="font-bold text-primary">{row.invoiceNumber}</span>
      )
    },
    {
      header: t('pos.todaySales.customer'),
      accessorKey: 'customer',
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.customerId?.name || t('pos.todaySales.walkInCustomer')}</span>
      )
    },
    {
      header: t('pos.todaySales.date'),
      accessorKey: 'saleDate',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{new Date(row.saleDate).toLocaleDateString()}</span>
      )
    },
    {
      header: t('pos.todaySales.paymentMode'),
      accessorKey: 'paymentMethod',
      cell: (row: any) => (
        <StatusBadge status={row.paymentMethod} />
      )
    },
    {
      header: t('pos.todaySales.total'),
      accessorKey: 'netAmount',
      cell: (row: any) => (
        <span className="font-black text-on-surface">{formatCurrency(row.netAmount)}</span>
      )
    },
    {
      header: t('pos.todaySales.actions'),
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => handleView(row)} className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleEdit(row)} className="h-8 w-8 text-on-surface-variant hover:text-warning hover:bg-warning/10 transition-colors">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(row._id, row.invoiceNumber)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.netAmount, 0);

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">{t('pos.todaySales.todaysSales')}</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            {t('pos.todaySales.todaysSalesDesc')}
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 shrink-0">
        <StatsCard
          title={t('pos.todaySales.totalRevenue')}
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          trend="+12.5%"
          trendDirection="up"
          trendLabel={t('pos.todaySales.vsYesterday')}
          colorTheme="primary"
        />
        <StatsCard
          title={t('pos.todaySales.totalInvoices')}
          value={sales.length.toString()}
          icon={CheckCircle2}
          trendLabel={t('pos.todaySales.completedToday')}
          colorTheme="success"
        />
        <StatsCard
          title={t('pos.todaySales.avgOrderValue')}
          value="₹1,002.10"
          icon={TrendingUp}
          trendLabel={t('pos.todaySales.higherThanUsual')}
          colorTheme="purple"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col min-h-[400px]">
        <DataTable
          data={sales}
          columns={columns}
          headerContent={
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-on-surface">{t('pos.todaySales.recentTransactions')}</h2>
              <StatusBadge status="Live Sync" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
            </div>
          }
          searchPlaceholder={t('pos.todaySales.searchReceiptCustomer')}
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
      {selectedSale && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sale={selectedSale}
          items={saleItems}
        />
      )}

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        itemName={deleteTarget?.invoiceNumber || t('common.item')}
      />
    </div>
  );
}
