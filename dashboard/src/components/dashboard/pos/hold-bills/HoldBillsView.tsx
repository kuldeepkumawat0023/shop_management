'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { PlayCircle, Trash2, Clock, Users, Banknote, ListPlus } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { usePOS } from '@/contexts/POSContext';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatCurrency';
import { useTranslation } from 'react-i18next';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function HoldBillsView() {
  const { heldBills, resumeBill, deleteHeldBill, loadingProducts } = usePOS();
  const router = useRouter();
  const { t } = useTranslation();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
      header: t('pos.holdBills.customer'), 
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
      header: t('pos.holdBills.items'), 
      accessorKey: 'cart',
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.cart.reduce((s: number, i: any) => s + i.quantity, 0)} Items</span>
      )
    },
    { 
      header: t('pos.holdBills.amount'), 
      accessorKey: 'id',
      cell: (row: any) => (
        <span className="font-black text-primary">
          {formatCurrency(row.cart.reduce((s: number, i: any) => s + (i.sellingPrice * i.quantity), 0))}
        </span>
      )
    },
    { 
      header: t('pos.holdBills.note'), 
      accessorKey: 'note',
      cell: (row: any) => (
        <span className="text-sm text-on-surface-variant italic">{row.note || '-'}</span>
      )
    },
    { 
      header: t('pos.holdBills.time'), 
      accessorKey: 'heldAt',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
          <Clock className="w-3.5 h-3.5" />
          {new Date(row.heldAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )
    },
    {
      header: t('pos.holdBills.actions'),
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10"
            onClick={() => handleResume(row.id)}
            title="Resume Bill / जारी रखें"
          >
            <PlayCircle className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10"
            onClick={() => setDeleteTarget(row.id)}
            title="Discard Bill / हटाएं"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loadingProducts) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">{t('pos.holdBills.holdBillsManagement')}</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            {t('pos.holdBills.holdBillsDesc')}
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard 
          title={t('pos.holdBills.totalHoldBills')}
          value={heldBills.length.toString()}
          icon={Users}
          trendLabel={t('pos.holdBills.activeHolds')}
          colorTheme="primary"
        />
        <StatsCard 
          title={t('pos.holdBills.todaysPaused')}
          value={heldBills.length.toString()}
          icon={Clock}
          trendLabel={t('pos.holdBills.today')}
          colorTheme="warning"
        />
        <StatsCard 
          title={t('pos.holdBills.totalValueHeld')}
          value={formatCurrency(totalValue)}
          icon={Banknote}
          trendLabel={t('pos.holdBills.potentialRevenue')}
          colorTheme="purple"
        />
        <StatsCard 
          title={t('pos.holdBills.totalItems')}
          value={totalItems.toString()}
          icon={ListPlus}
          trendLabel={t('pos.holdBills.awaitingCheckout')}
          colorTheme="success"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        {heldBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-on-surface-variant/50 gap-3">
            <Clock size={48} strokeWidth={1} />
            <p className="text-lg font-bold">{t('pos.holdBills.noHeldBills')}</p>
            <p className="text-sm">{t('pos.holdBills.noHeldBillsDesc')}</p>
          </div>
        ) : (
          <DataTable 
            data={heldBills}
            columns={columns}
            headerContent={
              <div className="flex items-center gap-2 shrink-0">
                <h2 className="text-lg font-bold text-on-surface">{t('pos.holdBills.activeHoldsTable')}</h2>
                <StatusBadge status="Live Status" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
              </div>
            }
            searchPlaceholder={t('pos.holdBills.searchHoldBills')}
            className="border-none shadow-none bg-transparent"
            itemsPerPage={10}
          />
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteHeldBill(deleteTarget);
          setDeleteTarget(null);
        }}
        itemName="Held Order / होल्ड किया गया बिल"
      />
    </div>
  );
}
