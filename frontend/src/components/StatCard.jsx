import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'emerald', subtitle, onClick }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {value !== undefined ? value : 0}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl border ${colorStyles[color] || colorStyles.emerald}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
