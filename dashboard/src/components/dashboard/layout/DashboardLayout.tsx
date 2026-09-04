'use client';

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background relative w-full overflow-x-hidden">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col md:ml-72 min-h-screen min-w-0 transition-all duration-300 max-w-full md:max-w-[calc(100vw-18rem)] relative">
        <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 min-w-0 w-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
