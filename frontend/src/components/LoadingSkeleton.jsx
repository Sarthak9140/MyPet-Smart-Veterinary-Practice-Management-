import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = 'h-12' }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`w-full ${height} bg-slate-200/80 rounded-xl`} />
      ))}
    </div>
  );
};
