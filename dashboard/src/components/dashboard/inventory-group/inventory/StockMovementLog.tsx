'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCcw, 
  Plus, 
  History 
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface StockMovementLogProps {
  data: any[];
  productName: string;
  sku?: string;
  onOpenAdjustModal?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function StockMovementLog({
  data = [],
  productName,
  sku,
  onOpenAdjustModal,
  onRefresh,
  isLoading = false
}: StockMovementLogProps) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  // Filter based on selected tab: ALL / IN / OUT
  const filteredData = useMemo(() => {
    let list = Array.isArray(data) ? [...data] : [];

    if (activeFilter === 'IN') {
      list = list.filter((item) => Number(item.quantityChanged) > 0);
    } else if (activeFilter === 'OUT') {
      list = list.filter((item) => Number(item.quantityChanged) < 0);
    }

    return list;
  }, [data, activeFilter]);

  // Standard DataTable Column Definitions
  const columns = useMemo(() => [
    {
      header: t('inventory.stockMovement.colTxnId', 'Transaction ID'),
      accessorKey: '_id',
      cell: (row: any) => {
        const shortId = (row._id ? String(row._id).slice(-8) : 'TXN').toUpperCase();
        return (
          <span className="font-mono font-semibold text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-lg tracking-wider">
            {shortId}
          </span>
        );
      }
    },
    {
      header: t('inventory.stockMovement.colDateTime', 'Date & Time'),
      accessorKey: 'createdAt',
      cell: (row: any) => {
        const createdDate = row.createdAt ? new Date(row.createdAt) : new Date();
        return (
          <span className="text-on-surface font-medium whitespace-nowrap">
            {createdDate.toLocaleString('en-IN', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </span>
        );
      }
    },
    {
      header: t('inventory.stockMovement.colItem', 'Item'),
      accessorKey: 'itemName',
      cell: () => (
        <div className="flex flex-col">
          <span className="font-bold text-on-surface line-clamp-1">{productName}</span>
          {sku && <span className="text-[10px] font-mono text-on-surface-variant">{sku}</span>}
        </div>
      )
    },
    {
      header: t('inventory.stockMovement.colType', 'Type'),
      accessorKey: 'movementType',
      cell: (row: any) => {
        const isPositive = Number(row.quantityChanged) > 0;
        const label = row.movementType || (isPositive ? 'STOCK IN' : 'STOCK OUT');

        if (isPositive) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/20 uppercase tracking-wider">
              <ArrowDownLeft className="w-3 h-3" />
              <span>{label}</span>
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-error/10 text-error border border-error/20 uppercase tracking-wider">
            <ArrowUpRight className="w-3 h-3" />
            <span>{label}</span>
          </span>
        );
      }
    },
    {
      header: t('inventory.stockMovement.colQty', 'Qty'),
      accessorKey: 'quantityChanged',
      cell: (row: any) => {
        const isPositive = Number(row.quantityChanged) > 0;
        return (
          <span
            className={cn(
              'inline-block px-2.5 py-1 rounded-lg font-black text-xs text-center min-w-[50px]',
              isPositive ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
            )}
          >
            {isPositive ? `+${row.quantityChanged}` : `${row.quantityChanged}`}
          </span>
        );
      }
    },
    {
      header: t('inventory.stockMovement.colStockAfter', 'Stock After'),
      accessorKey: 'stockAfter',
      cell: (row: any) => (
        <span className="font-black text-on-surface whitespace-nowrap">
          {row.stockAfter != null ? `${row.stockAfter} units` : '-'}
        </span>
      )
    },
    {
      header: t('inventory.stockMovement.colReference', 'Reference / Remarks'),
      accessorKey: 'remarks',
      cell: (row: any) => (
        <span
          className="text-on-surface-variant font-medium line-clamp-1 max-w-[200px]"
          title={row.remarks || row.referenceId || '-'}
        >
          {row.remarks || row.referenceId || '-'}
        </span>
      )
    },
    {
      header: t('inventory.stockMovement.colWarehouse', 'Warehouse / Staff'),
      accessorKey: 'warehouse',
      cell: (row: any) => {
        const userName = row.userId 
          ? `${row.userId.firstName || ''} ${row.userId.lastName || ''}`.trim() || row.userId.email || 'Admin'
          : 'System';
        return <span className="font-medium text-on-surface-variant">{userName}</span>;
      }
    }
  ], [productName, sku, t]);

  return (
    <div className="w-full min-w-0 max-w-full bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-sm overflow-hidden">
      <DataTable
        data={filteredData}
        columns={columns}
        searchPlaceholder={t('inventory.stockMovement.searchPlaceholder', 'Search by Item, Ref or ID...')}
        className="border-none shadow-none bg-transparent"
        headerContent={
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full min-w-0">
            {/* Title & Icon */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-on-surface tracking-tight truncate">
                  {t('inventory.stockMovement.stockLog', 'Stock Ledger Log')}
                </h2>
                <p className="text-xs font-medium text-on-surface-variant truncate">
                  {filteredData.length} {t('inventory.stockMovement.recordsFound', 'movement records')}
                </p>
              </div>
            </div>

            {/* Filter Pills & Actions */}
            <div className="flex flex-wrap items-center gap-2.5 min-w-0 max-w-full self-start md:self-auto">
              {/* Filter Tabs (ALL TYPES | STOCK IN | STOCK OUT) */}
              <div className="flex items-center bg-surface-container/60 p-1 rounded-2xl border border-outline-variant/20 overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveFilter('ALL')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                    activeFilter === 'ALL'
                      ? 'bg-on-surface text-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  )}
                >
                  {t('inventory.stockMovement.allTypes', 'ALL TYPES')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('IN')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap',
                    activeFilter === 'IN'
                      ? 'bg-success text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-success'
                  )}
                >
                  <ArrowDownLeft className="w-3 h-3" />
                  <span>{t('inventory.stockMovement.stockInTab', 'STOCK IN')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('OUT')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap',
                    activeFilter === 'OUT'
                      ? 'bg-error text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-error'
                  )}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{t('inventory.stockMovement.stockOutTab', 'STOCK OUT')}</span>
                </button>
              </div>

              {onRefresh && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRefresh}
                  disabled={isLoading}
                  title={t('common.refresh', 'Refresh')}
                  className="rounded-2xl shrink-0 h-9 w-9 border-outline-variant/25"
                >
                  <RotateCcw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                </Button>
              )}

              {onOpenAdjustModal && (
                <Button
                  onClick={onOpenAdjustModal}
                  size="sm"
                  className="gradient-button text-white font-bold text-xs rounded-2xl shrink-0 shadow-sm flex items-center gap-1.5 px-3.5 py-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('inventory.stockMovement.adjustBtn', 'Adjust')}</span>
                </Button>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default StockMovementLog;
