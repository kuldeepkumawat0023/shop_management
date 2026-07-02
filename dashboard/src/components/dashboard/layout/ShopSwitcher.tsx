'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Store, ChevronDown, CheckCircle2, Plus } from 'lucide-react';

const mockCompanies = [
  { _id: '1', name: 'Green Mart - Main Branch', logo: null },
  { _id: '2', name: 'Green Mart - Warehouse', logo: null },
  { _id: '3', name: 'Green Mart - North Zone', logo: null },
];

export default function ShopSwitcher() {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>(mockCompanies);
  const [activeCompany, setActiveCompany] = useState<any>(mockCompanies[0]);

  const handleSwitchCompany = async (company: any) => {
    if (company._id === activeCompany?._id) {
      setIsCompanyDropdownOpen(false);
      return;
    }
    setActiveCompany(company);
    setIsCompanyDropdownOpen(false);
  };

  const companyName = activeCompany?.name || 'SmartShop Admin';

  if (companies.length === 0) return null;

  return (
    <div className="mb-6 relative">
      <button
        onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer",
          isCompanyDropdownOpen ? "ring-2 ring-primary/20 border-primary/30" : ""
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {activeCompany?.logo ? (
              <img src={activeCompany.logo} alt={companyName} className="w-full h-full object-cover rounded-md" />
            ) : (
              <Store size={14} />
            )}
          </div>
          <span className="text-sm font-bold truncate text-on-surface">{companyName}</span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-on-surface-variant transition-transform duration-300 shrink-0",
            isCompanyDropdownOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Dropdown Panel */}
      <div className={cn(
        "absolute top-full left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out",
        isCompanyDropdownOpen ? "max-h-72 opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="py-2 bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/20 shadow-xl rounded-xl space-y-0.5 overflow-y-auto max-h-64">
          <div className="px-4 py-2 border-b border-outline-variant/10">
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Switch Workspace</p>
          </div>

          {companies.map((company: any) => (
            <button
              key={company._id}
              onClick={() => handleSwitchCompany(company)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                company._id === activeCompany?._id
                  ? "text-primary bg-primary/5"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              )}
            >
              <div className="flex items-center gap-3 w-full">
              <div className="w-6 h-6 rounded-md gradient-button flex items-center justify-center shrink-0 overflow-hidden">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-black text-white">{company.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="text-sm font-medium truncate flex-1">{company.name}</span>
              {company._id === activeCompany?._id && (
                <CheckCircle2 size={14} className="text-primary shrink-0" />
              )}
              </div>
            </button>
          ))}

          {/* Add New Company */}
          <div className="px-2 pt-1.5 mt-1 border-t border-outline-variant/10">
            <button
              onClick={() => {
                setIsCompanyDropdownOpen(false);
                // Trigger Create Company Modal later
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary hover:bg-primary/5 transition-colors rounded-lg group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Plus size={14} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest truncate">Add Branch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
