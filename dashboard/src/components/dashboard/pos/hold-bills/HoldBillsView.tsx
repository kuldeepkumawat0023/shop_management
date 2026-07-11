'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { PlayCircle, Trash2, Clock, Users, Banknote, ListPlus } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { usePOS } from '@/contexts/POSContext';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatCurrency';

export default function HoldBillsView() {
  const { heldBills, resumeBill } = usePOS();
  const router = useRouter();

  const totalValue = heldBills.reduce((sum, bill) => 
    sum + bill.cart.reduce((s, item) => s + (item.sellingPrice * item.quantity), 0), 0
  );
  const totalItems = heldBills.reduce((sum, bill) => 
    sum + bill.cart.reduce((s, item) => s + item.quantity, 0), 0
  );

  const handleResume = (billId: string) => {
    resumeBill(billId);
    router.push('/pos');
  };

  const columns = [
    { 
      header: 'Customer', 
      accessorKey: 'customer',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
            {(row.customer?.name || 'WC').substring(0, 2)}
          </div>
          <div>
            <div className="font-bold text-on-surface">{row.customer?.name || 'Walk-in Customer'}</div>
            <div className="text-xs text-on-surface-variant">{row.customer?.phone || '-'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Items', 
      accessorKey: 'cart',
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.cart.reduce((s: number, i: any) => s + i.quantity, 0)} Items</span>
      )
    },
    { 
      header: 'Amount', 
      accessorKey: 'id',
      cell: (row: any) => (
        <span className="font-black text-primary">
          {formatCurrency(row.cart.reduce((s: number, i: any) => s + (i.sellingPrice * i.quantity), 0))}
        </span>
      )
    },
    { 
      header: 'Note', 
      accessorKey: 'note',
      cell: (row: any) => (
        <span className="text-sm text-on-surface-variant italic">{row.note || '-'}</span>
      )
    },
    { 
      header: 'Time', 
      accessorKey: 'heldAt',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
          <Clock className="w-3.5 h-3.5" />
          {new Date(row.heldAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10"
            onClick={() => handleResume(row.id)}
          >
            <PlayCircle className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Hold Bills Management</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Review paused orders, resume transactions. / रुके हुए ऑर्डर देखें।
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard 
          title="Total Hold Bills"
          value={heldBills.length.toString()}
          icon={Users}
          trendLabel="ACTIVE HOLDS"
          colorTheme="primary"
        />
        <StatsCard 
          title="Today's Paused"
          value={heldBills.length.toString()}
          icon={Clock}
          trendLabel="TODAY"
          colorTheme="warning"
        />
        <StatsCard 
          title="Total Value Held"
          value={formatCurrency(totalValue)}
          icon={Banknote}
          trendLabel="POTENTIAL REVENUE"
          colorTheme="purple"
        />
        <StatsCard 
          title="Total Items"
          value={totalItems.toString()}
          icon={ListPlus}
          trendLabel="AWAITING CHECKOUT"
          colorTheme="success"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        {heldBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-on-surface-variant/50 gap-3">
            <Clock size={48} strokeWidth={1} />
            <p className="text-lg font-bold">No held bills / कोई रुका हुआ बिल नहीं</p>
            <p className="text-sm">When you hold a bill from the POS, it will appear here.</p>
          </div>
        ) : (
          <DataTable 
            data={heldBills}
            columns={columns}
            headerContent={
              <div className="flex items-center gap-2 shrink-0">
                <h2 className="text-lg font-bold text-on-surface">Active Holds</h2>
                <StatusBadge status="Live Status" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
              </div>
            }
            searchPlaceholder="Search by customer name..."
            className="border-none shadow-none bg-transparent"
            itemsPerPage={10}
          />
        )}
      </div>
    </div>
  );
}
