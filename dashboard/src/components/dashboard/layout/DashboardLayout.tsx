'use client';

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background relative">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col md:ml-72 min-h-screen transition-all duration-300 w-full relative">
        <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
