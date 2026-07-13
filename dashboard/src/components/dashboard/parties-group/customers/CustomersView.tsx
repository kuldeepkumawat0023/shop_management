'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Users, UserCheck, UserPlus, IndianRupee, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// We will use React state for these instead of static arrays

import { customerService } from '@/lib/services/customer.services';
import toast from 'react-hot-toast';

export default function CustomersView() {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers();
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        const res = await customerService.deleteCustomer(id);
        if (res.success) {
          toast.success('Customer deleted successfully');
          fetchCustomers();
        } else {
          toast.error(res.message || 'Failed to delete customer');
        }
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };
  const columns = [
    { header: 'Name', accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-primary">{row.name}</span> },
    { header: 'Email & Phone', accessorKey: 'contact', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-on-surface">{row.email || 'N/A'}</span>
        <span className="text-xs text-on-surface-variant">{row.mobile}</span>
      </div>
    )},
    { header: 'Total Spent', accessorKey: 'totalSpent', cell: (row: any) => <span className="font-bold text-on-surface">₹{(row.dueAmount || 0).toLocaleString()}</span> },
    { header: 'Credit Limit', accessorKey: 'creditLimit', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{(row.creditLimit || 0).toLocaleString()}</span> },
    { header: 'Status', accessorKey: 'isActive', cell: (row: any) => <StatusBadge status={row.isActive !== false ? 'Active' : 'Inactive'} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/customers/${row._id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/customers/${row._id}/edit`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Edit className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => handleDelete(row._id)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )},
  ];

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.mobile && c.mobile.includes(searchQuery)) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // KPIs calculation
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive !== false).length;
  // Calculate new this month
  const currentMonth = new Date().getMonth();
  const newThisMonth = customers.filter(c => new Date(c.createdAt).getMonth() === currentMonth).length;
  // Total Receivables (using dueAmount as a placeholder)
  const totalReceivables = customers.reduce((sum, c) => sum + (Number(c.dueAmount) || 0), 0);

  const customerKPIs = [
    { title: "Total Customers", value: totalCustomers.toString(), trend: "All time", isPositive: true, icon: Users },
    { title: "Active Customers", value: activeCustomers.toString(), trend: "Currently active", isPositive: true, icon: UserCheck },
    { title: "New This Month", value: newThisMonth.toString(), trend: "Current month", isPositive: true, icon: UserPlus },
    { title: "Total Receivables", value: `₹${totalReceivables.toLocaleString()}`, trend: "Outstanding due", isPositive: false, icon: IndianRupee },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Customers</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage your customer relationships and track spending.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/customers/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {customerKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Loading customers...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredCustomers} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
