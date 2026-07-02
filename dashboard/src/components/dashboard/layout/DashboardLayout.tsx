'use client';

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden transition-all duration-300">
        <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
