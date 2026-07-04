'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Megaphone, Plus, Bell, MousePointerClick, Send, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

// Mock Data
const campaigns = [
  { id: 'camp_001', title: 'System Maintenance - v2.4 Update', type: 'Dashboard Banner', audience: 'All Branches', status: 'Completed', date: 'Oct 12, 2026' },
  { id: 'camp_002', title: 'Holiday Sale - 20% Off Pro Plan', type: 'Push Notification', audience: 'Basic Users', status: 'Active', date: 'Oct 15, 2026' },
  { id: 'camp_003', title: 'New Offline POS Feature Live', type: 'Dashboard Alert', audience: 'Pro & Enterprise', status: 'Active', date: 'Oct 18, 2026' },
  { id: 'camp_004', title: 'Beta Testing Opt-in', type: 'Email', audience: 'Enterprise Only', status: 'Draft', date: 'Oct 20, 2026' },
  { id: 'camp_005', title: 'Diwali Special Offer', type: 'Dashboard Banner', audience: 'All Branches', status: 'Active', date: 'Oct 22, 2026' },
];

export default function MarketingView() {
  const [activeTab, setActiveTab] = useState('All');
  const [allCampaigns, setAllCampaigns] = useState(campaigns);
  const tabs = ['All', 'Active', 'Draft', 'Completed'];

  useEffect(() => {
    // Merge localStorage campaigns with initial static campaigns
    const saved = localStorage.getItem('mockCampaigns');
    if (saved) {
      const parsedSaved = JSON.parse(saved);
      // Optional: Filter out duplicates if you refresh, but for mock purposes we just prepend them
      setAllCampaigns([...parsedSaved, ...campaigns]);
    }
  }, []);

  const filteredData = allCampaigns.filter(campaign => {
    if (activeTab === 'All') return true;
    return campaign.status === activeTab;
  });

  const columns = [
    {
      header: 'Campaign Title',
      accessorKey: 'title',
      cell: (row: any) => (
        <div>
          <p className="text-sm font-bold text-on-surface">{row.title}</p>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">ID: {row.id}</p>
        </div>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (row: any) => {
        let Icon = Megaphone;
        if (row.type === 'Push Notification') Icon = Bell;
        if (row.type === 'Email') Icon = Mail;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-on-surface-variant">{row.type}</span>
          </div>
        );
      }
    },
    {
      header: 'Audience',
      accessorKey: 'audience',
      cell: (row: any) => (
        <span className="text-sm font-bold text-on-surface">{row.audience}</span>
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
        let variant = 'success';
        if (row.status === 'Draft') variant = 'warning';
        if (row.status === 'Completed') variant = 'secondary';
        return <StatusBadge status={row.status} variant={variant as any} />;
      }
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
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Marketing & Announcements</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Broadcast messages, banners, and updates to shop owners.</p>
        </div>
        <Link href="/marketing/new">
          <Button className="gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span className="font-bold tracking-wide">New Campaign</span>
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Campaigns"
          value={allCampaigns.filter(c => c.status === 'Active').length.toString()}
          icon={Megaphone}
          colorTheme="primary"
          trend="1"
          trendDirection="up"
          trendLabel="NEW THIS WEEK"
        />
        <StatsCard
          title="Total Reach"
          value="845"
          icon={Bell}
          colorTheme="success"
          trend="12%"
          trendDirection="up"
          trendLabel="AUDIENCE GROWTH"
        />
        <StatsCard
          title="Avg. Open Rate"
          value="68%"
          icon={MousePointerClick}
          colorTheme="secondary"
          trend="4%"
          trendDirection="up"
          trendLabel="ENGAGEMENT"
        />
        <StatsCard
          title="Drafts"
          value={allCampaigns.filter(c => c.status === 'Draft').length.toString()}
          icon={Send}
          colorTheme="warning"
          trend="0"
          trendDirection="down"
          trendLabel="PENDING LAUNCH"
        />
      </div>

      {/* Campaigns Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col mb-6">
        <DataTable
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Campaign List</h2>
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search campaigns by title..."
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent"
        />
      </div>
    </div>
  );
}
