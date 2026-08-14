import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Dog,
  Syringe,
  BellRing,
  Package,
  Bell,
  User,
  Info,
  Settings,
  LogOut,
  Stethoscope,
  X
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, closeMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pets', path: '/pets', icon: Dog },
    { name: 'Vaccinations', path: '/vaccinations', icon: Syringe },
    { name: 'Reminders', path: '/reminders', icon: BellRing },
    { name: 'Products & Stock', path: '/products', icon: Package },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Stethoscope className="w-4 h-4" />
          </div>
          <span>My<span className="text-brand-400">Pet</span></span>
        </NavLink>
        {mobileOpen && (
          <button onClick={closeMobile} className="text-slate-400 hover:text-white p-1 md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  isActive
                    ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeMobile} />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
