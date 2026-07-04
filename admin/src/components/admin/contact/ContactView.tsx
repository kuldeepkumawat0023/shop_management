'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Mail, Clock, CheckCircle2, MessageSquare, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import ContactDetailDrawer from './ContactDetailDrawer';

// Mock Data
export const inquiries = [
  { 
    id: 'inq_001', 
    name: 'Rahul Sharma', 
    email: 'rahul.s@example.com', 
    subject: 'Pricing for 5 shops', 
    message: 'Hi, I run a chain of 5 grocery stores. Do you have a custom enterprise pricing plan for me? Also, does your system support offline sync for all 5 stores?',
    date: 'Oct 24, 2026', 
    status: 'New' 
  },
  { 
    id: 'inq_002', 
    name: 'Priya Verma', 
    email: 'priya.v@gmail.com', 
    subject: 'Cannot login to Dashboard', 
    message: 'I signed up yesterday but my verification email has not arrived. Can you please manually verify my account?',
    date: 'Oct 23, 2026', 
    status: 'Replied' 
  },
  { 
    id: 'inq_003', 
    name: 'Amit Kumar', 
    email: 'amit.k@store.in', 
    subject: 'Feature Request: POS integration', 
    message: 'Is it possible to integrate your system with our existing Epson thermal printers and barcode scanners?',
    date: 'Oct 22, 2026', 
    status: 'Read' 
  },
  { 
    id: 'inq_004', 
    name: 'Neha Singh', 
    email: 'neha@boutique.com', 
    subject: 'Account Deletion', 
    message: 'Please delete my account and remove my credit card information. We are closing our business.',
    date: 'Oct 21, 2026', 
    status: 'Replied' 
  },
  { 
    id: 'inq_005', 
    name: 'Vikas Jain', 
    email: 'vikas.j@hardware.com', 
    subject: 'App not syncing', 
    message: 'The mobile app is not syncing the inventory changes made on the web dashboard. Please check this urgently.',
    date: 'Oct 24, 2026', 
    status: 'New' 
  },
];

export default function ContactView() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const tabs = ['All', 'New', 'Read', 'Replied'];

  const filteredData = inquiries.filter(inq => {
    if (activeTab === 'All') return true;
    return inq.status === activeTab;
  });

  const handleRowClick = (row: any) => {
    setSelectedInquiry(row);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      header: 'Sender Name',
      accessorKey: 'name',
      cell: (row: any) => (
        <div>
          <p className="text-sm font-bold text-on-surface">{row.name}</p>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface truncate max-w-[200px] block">{row.subject}</span>
      )
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{row.date}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => {
        let variant = 'primary'; // New
        if (row.status === 'Replied') variant = 'success';
        if (row.status === 'Read') variant = 'secondary';
        return <StatusBadge status={row.status} variant={variant as any} />;
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
          className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  const TabsComponent = (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start lg:self-auto overflow-x-auto max-w-[calc(100vw-2rem)] lg:max-w-none no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Contact Inquiries</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage support and sales messages from the public website.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="New Messages"
          value="2"
          icon={MessageSquare}
          colorTheme="primary"
          trend="2"
          trendDirection="up"
          trendLabel="TODAY"
        />
        <StatsCard
          title="Total Inquiries"
          value="156"
          icon={Mail}
          colorTheme="secondary"
          trend="12%"
          trendDirection="up"
          trendLabel="THIS MONTH"
        />
        <StatsCard
          title="Avg. Response"
          value="1h 20m"
          icon={Clock}
          colorTheme="warning"
          trend="10m"
          trendDirection="down"
          trendLabel="FASTER"
        />
        <StatsCard
          title="Resolved"
          value="98%"
          icon={CheckCircle2}
          colorTheme="success"
          trend="0.5%"
          trendDirection="up"
          trendLabel="VS LAST MONTH"
        />
      </div>

      {/* Inquiries Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col mb-6">
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Inbox</h2>
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search by name, email, or subject..."
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent hover-row-pointer"
        />
      </div>

      <ContactDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        inquiry={selectedInquiry}
      />
    </div>
  );
}
