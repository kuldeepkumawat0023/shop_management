import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';
import { Input } from '@/components/common/Input';

interface ColumnDef {
  header: string | React.ReactNode;
  accessorKey: string;
  cell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: ColumnDef[];
  searchPlaceholder?: string;
  headerContent?: React.ReactNode;
  className?: string;
}

export function DataTable({ data, columns, searchPlaceholder, headerContent, className }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Basic filtering based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  return (
    <div className={cn("flex flex-col h-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm", className)}>
      {(searchPlaceholder || headerContent) && (
        <div className="p-4 border-b border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface/50">
          <div className="flex-1 w-full flex overflow-x-auto custom-scrollbar">
            {headerContent}
          </div>
          {searchPlaceholder && (
            <div className="relative w-full sm:max-w-sm shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface border border-outline-variant/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface-container border-b border-outline-variant/10 z-10">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx} 
                  className="hover:bg-surface/40 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className="px-6 py-4 text-sm font-medium text-on-surface-variant whitespace-nowrap"
                    >
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-bold text-on-surface-variant">No data found</p>
                    <p className="text-xs text-on-surface-variant/60">Try adjusting your search query.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
