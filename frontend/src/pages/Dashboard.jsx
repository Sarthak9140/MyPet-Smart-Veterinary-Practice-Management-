import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import api from '../services/api';
import {
  Dog,
  Syringe,
  Clock,
  ShieldAlert,
  Package,
  AlertTriangle,
  Plus,
  ArrowRight,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to connect to backend database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-200/80 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton count={4} height="h-28" />
        </div>
        <LoadingSkeleton count={2} height="h-64" />
      </div>
    );
  }

  const { stats, lists, charts } = data || {
    stats: { totalPets: 0, upcomingVaccinations: 0, dueToday: 0, overdue: 0, totalProducts: 0, lowStockProducts: 0 },
    lists: { todayVaccinations: [], upcomingVaccinations: [], overdueVaccinations: [] },
    charts: { petTypes: [], inventoryStatus: [] }
  };

  const COLORS = ['#10B981', '#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B'];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Dog className="w-64 h-64 text-white" />
        </div>
        <div className="space-y-1 z-10">
          <span className="px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            {user?.clinicName || 'Practice Dashboard'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
            Welcome back, {user?.name || 'Doctor'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Here is your daily practice overview, vaccination alerts, and inventory status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <button
            onClick={() => navigate('/vaccinations?action=add')}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Vaccination
          </button>
          <button
            onClick={() => navigate('/pets?action=add')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Register Pet
          </button>
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Pets"
          value={stats.totalPets}
          icon={Dog}
          color="emerald"
          subtitle="Registered patients"
          onClick={() => navigate('/pets')}
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          icon={Clock}
          color="amber"
          subtitle="Scheduled today"
          onClick={() => navigate('/vaccinations?status=Due Today')}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={ShieldAlert}
          color="rose"
          subtitle="Requires attention"
          onClick={() => navigate('/vaccinations?status=Overdue')}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingVaccinations}
          icon={Syringe}
          color="teal"
          subtitle="Next 30 days"
          onClick={() => navigate('/vaccinations?status=Upcoming')}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
          subtitle="Inventory items"
          onClick={() => navigate('/products')}
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          color="purple"
          subtitle="Reorder required"
          onClick={() => navigate('/products?stockStatus=Low Stock')}
        />
      </div>

      {/* Vaccination Overview Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Due Today */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Due Today</h3>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full">
              {lists.todayVaccinations.length}
            </span>
          </div>

          {lists.todayVaccinations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No vaccinations due today.
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lists.todayVaccinations.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate('/vaccinations')}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.petName}</h4>
                    <p className="text-[11px] text-slate-600 font-medium">{item.vaccineName}</p>
                    <p className="text-[10px] text-amber-700 mt-1 font-semibold flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Owner: {item.ownerName}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Overdue</h3>
            </div>
            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-full">
              {lists.overdueVaccinations.length}
            </span>
          </div>

          {lists.overdueVaccinations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No overdue vaccinations. Great job!
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lists.overdueVaccinations.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate('/vaccinations')}
                  className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 hover:bg-rose-100/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.petName}</h4>
                    <p className="text-[11px] text-slate-600 font-medium">{item.vaccineName}</p>
                    <p className="text-[10px] text-rose-700 mt-1 font-bold">
                      {item.daysOverdue} day(s) overdue • Owner: {item.ownerName}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-100 text-brand-700 rounded-xl">
                <Syringe className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Upcoming</h3>
            </div>
            <Link to="/vaccinations" className="text-xs text-brand-600 font-bold hover:underline">
              View all
            </Link>
          </div>

          {lists.upcomingVaccinations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No upcoming vaccinations scheduled.
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lists.upcomingVaccinations.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate('/vaccinations')}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.petName}</h4>
                    <p className="text-[11px] text-slate-600 font-medium">{item.vaccineName}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Due in {item.daysRemaining} day(s) ({new Date(item.nextVaccinationDate).toLocaleDateString()})
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart 1: Pet Species Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Patient Species Distribution</h3>
          <div className="h-64 w-full">
            {charts.petTypes && charts.petTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.petTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.petTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                No patient data registered yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Inventory Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Inventory Stock Status</h3>
          <div className="h-64 w-full">
            {charts.inventoryStatus && charts.inventoryStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.inventoryStatus}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {charts.inventoryStatus.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color || '#10B981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                No inventory data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
