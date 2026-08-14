import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Settings, Bell, Shield, Save, Check } from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [daysBefore, setDaysBefore] = useState(
    user?.notificationPreferences?.daysBefore || [2, 1, 0]
  );
  const [loading, setLoading] = useState(false);

  const toggleDay = (day) => {
    if (daysBefore.includes(day)) {
      setDaysBefore(daysBefore.filter((d) => d !== day));
    } else {
      setDaysBefore([...daysBefore, day]);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', {
        notificationPreferences: {
          daysBefore
        }
      });
      if (res.data.success) {
        updateUserProfile(res.data.data);
        addToast('Reminder preferences updated successfully');
      }
    } catch (err) {
      addToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Practice Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure automated vaccination reminder timing, alert preferences, and account controls
        </p>
      </div>

      {/* Reminder Timing Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-600" /> Vaccination Reminder Timing
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <p className="text-xs text-slate-600">
            Choose when the backend scheduler should trigger alerts for upcoming booster vaccinations:
          </p>

          <div className="space-y-3">
            <label
              onClick={() => toggleDay(2)}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                daysBefore.includes(2)
                  ? 'bg-brand-50/60 border-brand-300 text-brand-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    daysBefore.includes(2) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {daysBefore.includes(2) && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs">2 Days Before Due Date</span>
                  <p className="text-[10px] text-slate-400 font-normal">Early advance reminder for clinic scheduling</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-600">Advance Alert</span>
            </label>

            <label
              onClick={() => toggleDay(1)}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                daysBefore.includes(1)
                  ? 'bg-brand-50/60 border-brand-300 text-brand-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    daysBefore.includes(1) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {daysBefore.includes(1) && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs">1 Day Before Due Date (Tomorrow)</span>
                  <p className="text-[10px] text-slate-400 font-normal">Reminder for next day patient appointments</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600">Tomorrow Alert</span>
            </label>

            <label
              onClick={() => toggleDay(0)}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                daysBefore.includes(0)
                  ? 'bg-brand-50/60 border-brand-300 text-brand-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    daysBefore.includes(0) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {daysBefore.includes(0) && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs">On Due Date (Today)</span>
                  <p className="text-[10px] text-slate-400 font-normal">Actionable alert on the exact due date</p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600">Due Today</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-md shadow-brand-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
