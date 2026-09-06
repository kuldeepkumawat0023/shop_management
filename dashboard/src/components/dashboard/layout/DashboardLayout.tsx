'use client';

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen max-h-screen flex bg-background relative w-full overflow-hidden">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col md:ml-72 h-screen max-h-screen min-h-0 min-w-0 transition-all duration-300 max-w-full md:max-w-[calc(100vw-18rem)] relative overflow-hidden">
        <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 min-w-0 min-h-0 w-full flex flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
