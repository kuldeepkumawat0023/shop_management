import React from 'react';
import { Skeleton } from './Skeleton';

export function ViewPageSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <Skeleton className="h-5 w-80 rounded-lg" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-24 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-8 w-32 rounded-lg mb-2" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
          <Skeleton className="h-10 w-full sm:w-96 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-24 rounded-xl" />
        </div>

        {/* Data Table */}
        <div className="flex-1 p-5">
          {/* Header Row */}
          <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-4 mb-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-5 w-full rounded-lg" />
            ))}
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={`row-${i}`} className="flex items-center gap-4 pb-4 border-b border-outline-variant/10">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={`cell-${i}-${j}`} className="h-6 w-full rounded-lg" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
