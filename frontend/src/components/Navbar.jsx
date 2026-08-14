import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Bell, Search, User, LogOut, Menu, X, Check, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export const PublicNavbar = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span>My<span className="text-brand-600">Pet</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-brand-600 transition">Home</Link>
            <a href="#features" className="hover:text-brand-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition">How It Works</a>
            <Link to="/about" className="hover:text-brand-600 transition">About</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-md shadow-brand-600/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-md shadow-brand-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" className="block py-2 text-slate-700 hover:text-brand-600 font-medium">Home</Link>
          <a href="#features" className="block py-2 text-slate-700 hover:text-brand-600 font-medium">Features</a>
          <a href="#how-it-works" className="block py-2 text-slate-700 hover:text-brand-600 font-medium">How It Works</a>
          <Link to="/about" className="block py-2 text-slate-700 hover:text-brand-600 font-medium">About</Link>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <Link to="/dashboard" className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-medium">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="w-full text-center py-2 text-slate-700 font-medium">Login</Link>
                <Link to="/register" className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-medium">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const DashboardHeader = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-8 justify-between">
      {/* Left side: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-64 lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pets, owners, vaccinations..."
            onClick={() => navigate('/vaccinations')}
            readOnly
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:border-brand-500 rounded-xl transition cursor-pointer"
          />
        </div>
      </div>

      {/* Right side: Notifications & Doctor Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        setNotifOpen(false);
                        navigate('/notifications');
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                        !n.isRead ? 'bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'OVERDUE' ? (
                          <ShieldAlert className="w-5 h-5 text-rose-500" />
                        ) : (
                          <Bell className="w-5 h-5 text-brand-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          title="Mark read"
                          className="self-center p-1 text-slate-400 hover:text-brand-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name || 'Doctor'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                {user?.clinicName || 'Clinic'}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <User className="w-4 h-4 text-slate-500" /> My Profile
              </Link>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-500" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
