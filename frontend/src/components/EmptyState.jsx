import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon = FolderOpen }) => {
  return (
    <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
