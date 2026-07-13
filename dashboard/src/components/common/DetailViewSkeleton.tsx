import React from 'react';
import { Skeleton } from './Skeleton';

export function DetailViewSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-9 w-64 rounded-lg mb-2" />
            <Skeleton className="h-5 w-48 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
            <Skeleton className="h-6 w-48 rounded-lg mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-6 w-32 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
            <Skeleton className="h-6 w-48 rounded-lg mb-6" />
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                  <Skeleton className="h-5 w-32 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-lg" />
                  <Skeleton className="h-5 w-24 rounded-lg" />
                  <Skeleton className="h-5 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
            <Skeleton className="h-6 w-48 rounded-lg mb-6" />
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-5 w-24 rounded-lg" />
                  <Skeleton className="h-5 w-32 rounded-lg" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
