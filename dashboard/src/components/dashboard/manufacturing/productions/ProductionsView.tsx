'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Factory, CheckCircle2, Eye, Trash2, Activity, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { productionService } from '@/lib/services/production.services';
import toast from 'react-hot-toast';

export default function ProductionsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [productionsData, setProductionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All Runs', 'Completed'];
  const [activeTab, setActiveTab] = useState('All Runs');

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const res = await productionService.getProductions();
      if (res.success) {
        setProductionsData(res.data.map((prod: any) => ({
          id: prod._id,
          recipe: prod.finalProductId?.name || prod.recipeId?.finalProductId?.name || 'Unknown',
          startDate: new Date(prod.productionDate || prod.createdAt).toLocaleDateString('en-IN'),
          quantityProduced: prod.quantityProduced,
          cost: prod.totalCost || 0,
          status: 'Completed',
          loggedBy: prod.userId?.name || 'Unknown',
        })));
      }
    } catch (err) {
      console.error('Error fetching productions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('WARNING: Deleting this production log will REVERSE stock changes. Final product stock will decrease, and raw materials will be restored. Are you sure?')) {
      try {
        const res = await productionService.deleteProduction(id);
        if (res.success) {
          toast.success('Production log deleted & stock reversed');
          setProductionsData(prev => prev.filter(p => p.id !== id));
        } else {
          toast.error(res.message || 'Failed to delete production');
        }
      } catch (err) {
        toast.error('Error deleting production log');
      }
    }
  };

  const filteredData = productionsData.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recipe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All Runs' ? true : p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Dynamic stats
  const totalRuns = productionsData.length;
  const totalCost = productionsData.reduce((sum, p) => sum + p.cost, 0);
  const totalProduced = productionsData.reduce((sum, p) => sum + p.quantityProduced, 0);

  const columns = [
    { header: 'Run ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface font-mono text-xs">{row.id.slice(-6).toUpperCase()}</span> },
    { header: 'Product', accessorKey: 'recipe', cell: (row: any) => <span className="font-semibold text-primary">{row.recipe}</span> },
    { header: 'Date', accessorKey: 'startDate' },
    { header: 'Qty Produced', accessorKey: 'quantityProduced', cell: (row: any) => <span className="font-medium text-on-surface">{row.quantityProduced} Units</span> },
    { header: 'Total Cost', accessorKey: 'cost', cell: (row: any) => `₹${row.cost.toLocaleString()}` },
    { header: 'Logged By', accessorKey: 'loggedBy' },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/manufacturing/productions/${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const TabsComponent = (
    <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit overflow-x-auto max-w-[calc(100vw-2rem)] no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full ">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Production Runs</h2>
          <p className="text-sm font-medium text-on-surface-variant">Track manufacturing progress, yields, and associated costs.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export Log
          </Button>
          <Link href="/manufacturing/productions/new" className="flex-1 sm:flex-none w-full sm:w-auto">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">New Production</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title="Total Runs"
          value={totalRuns}
          icon={Factory}
          trendLabel="ALL TIME"
          colorTheme="primary"
        />
        <StatsCard
          title="Units Produced"
          value={totalProduced.toLocaleString()}
          icon={Activity}
          trendLabel="TOTAL OUTPUT"
          colorTheme="blue"
        />
        <StatsCard
          title="Success Rate"
          value={`${totalRuns > 0 ? '100' : '0'}%`}
          icon={CheckCircle2}
          trendLabel="Completed Runs"
          colorTheme="success"
        />
        <StatsCard
          title="Total Prod. Cost"
          value={`₹${totalCost >= 100000 ? (totalCost / 100000).toFixed(1) + 'L' : totalCost.toLocaleString()}`}
          icon={ClipboardList}
          trendLabel="ALL TIME EXPENSE"
          colorTheme="yellow"
        />
      </div>

      {/* Productions Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant font-medium">Loading Productions...</div>
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            searchPlaceholder="Search runs by ID or Product..."
            itemsPerPage={10}
            headerContent={
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface">Production Log</h3>
                </div>
                {TabsComponent}
              </div>
            }
            className="border-none shadow-none"
          />
        )}
      </div>
    </div>
  );
}
