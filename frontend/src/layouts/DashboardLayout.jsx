import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/Navbar';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        closeMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          sidebarOpen={mobileSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
