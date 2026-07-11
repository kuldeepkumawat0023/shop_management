'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Printer, Eye, TrendingUp, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { saleService } from '@/lib/services/sale.services';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import InvoiceModal from '@/components/dashboard/pos/today-sales/InvoiceModal';
import { useRouter } from 'next/navigation';
import { usePOS } from '@/contexts/POSContext';

export default function TodaySalesView() {
  const router = useRouter();
  const { setCart, setDiscount, setTax, setEditSaleId } = usePOS();

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
      toast.error('Failed to load sales / बिक्री लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (sale: any) => {
    const toastId = toast.loading('Loading invoice...');
    try {
      const res = await saleService.getSaleById(sale._id);
      if (res.success) {
        setSelectedSale(res.data.sale);
        setSaleItems(res.data.items);
        setIsModalOpen(true);
        toast.dismiss(toastId);
      }
    } catch (error) {
      toast.error('Failed to load invoice details / चालान विवरण लोड करने में विफल', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale? This will revert stock. / क्या आप सुनिश्चित हैं कि आप इस बिक्री को हटाना चाहते हैं? यह स्टॉक वापस कर देगा।')) return;

    const toastId = toast.loading('Deleting sale... / बिक्री हटाई जा रही है...');
    try {
      const res = await saleService.deleteSale(id);
      if (res.success) {
        toast.success('Sale deleted successfully / बिक्री सफलतापूर्वक हटा दी गई', { id: toastId });
        setSales(sales.filter(s => s._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete sale / बिक्री हटाने में विफल', { id: toastId });
    }
  };

  const handleEdit = async (sale: any) => {
    const toastId = toast.loading('Loading sale for edit...');
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
      toast.error('Failed to load sale data / बिक्री डेटा लोड करने में विफल', { id: toastId });
    }
  };
  const columns = [
    {
      header: 'Invoice ID',
      accessorKey: 'invoiceNumber',
      cell: (row: any) => (
        <span className="font-bold text-primary">{row.invoiceNumber}</span>
      )
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.customerId?.name || 'Walk-in Customer'}</span>
      )
    },
    {
      header: 'Date',
      accessorKey: 'saleDate',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{new Date(row.saleDate).toLocaleDateString()}</span>
      )
    },
    {
      header: 'Payment Mode',
      accessorKey: 'paymentMethod',
      cell: (row: any) => (
        <StatusBadge status={row.paymentMethod} />
      )
    },
    {
      header: 'Total',
      accessorKey: 'netAmount',
      cell: (row: any) => (
        <span className="font-black text-on-surface">{formatCurrency(row.netAmount)}</span>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => handleView(row)} className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleEdit(row)} className="h-8 w-8 text-on-surface-variant hover:text-warning hover:bg-warning/10 transition-colors">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(row._id)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.netAmount, 0);

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Today's Sales</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Review invoices generated today, track revenue, and monitor average order value.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 shrink-0">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          trend="+12.5%"
          trendDirection="up"
          trendLabel="vs yesterday"
          colorTheme="primary"
        />
        <StatsCard
          title="Total Invoices"
          value={sales.length.toString()}
          icon={CheckCircle2}
          trendLabel="COMPLETED TODAY"
          colorTheme="success"
        />
        <StatsCard
          title="Avg Order Value"
          value="₹1,002.10"
          icon={TrendingUp}
          trendLabel="HIGHER THAN USUAL"
          colorTheme="purple"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading sales...</div>
        ) : (
          <DataTable
            data={sales}
            columns={columns}
            headerContent={
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-on-surface">Recent Transactions</h2>
                <StatusBadge status="Live Sync" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
              </div>
            }
            searchPlaceholder="Search by receipt or customer..."
            className="border-none shadow-none bg-transparent"
            itemsPerPage={10}
          />
        )}
      </div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sale={selectedSale}
        items={saleItems}
      />
    </div>
  );
}
