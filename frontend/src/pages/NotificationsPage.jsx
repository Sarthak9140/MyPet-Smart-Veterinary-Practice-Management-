import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  ShieldAlert,
  Clock,
  Package,
  Info
} from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const { addToast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      addToast('Notification marked as read');
      fetchNotifications();
    } catch (err) {
      addToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      addToast('All notifications marked as read');
      fetchNotifications();
    } catch (err) {
      addToast('Failed to update notifications', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      addToast('Notification deleted');
      fetchNotifications();
    } catch (err) {
      addToast('Failed to delete notification', 'error');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated vaccination reminders, due-today notifications, and low-stock inventory alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs transition flex items-center justify-center gap-2 border border-brand-200"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread Alerts
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton count={4} height="h-20" />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You are all caught up! No vaccination or inventory alerts found."
          icon={Bell}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? 'bg-white border-brand-200 shadow-md ring-1 ring-brand-100'
                  : 'bg-white/60 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {n.type === 'OVERDUE' ? (
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  ) : n.type === 'REMINDER_TODAY' ? (
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                      <Clock className="w-5 h-5" />
                    </div>
                  ) : n.type === 'INVENTORY_LOW' ? (
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                      <Package className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-3 bg-brand-100 text-brand-600 rounded-2xl">
                      <Bell className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">{n.title}</h4>
                    {!n.isRead && (
                      <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-extrabold rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    Received on {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition text-xs font-bold flex items-center gap-1"
                    title="Mark Read"
                  >
                    <Check className="w-4 h-4" /> Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
