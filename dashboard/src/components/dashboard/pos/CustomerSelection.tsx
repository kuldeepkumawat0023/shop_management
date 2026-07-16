'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, X, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { usePOS } from '@/contexts/POSContext';
import { customerService } from '@/lib/services/customer.services';
import CustomerCreateModal from './CustomerCreateModal';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

interface CustomerData {
  _id: string;
  name: string;
  mobile: string;
  phone?: string;
}

export default function CustomerSelection() {
  const { selectedCustomer, setSelectedCustomer } = usePOS();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await customerService.getCustomers();
        if (res.success) {
          // Map backend 'mobile' to 'phone' for consistency
          setCustomers(res.data.map((c: any) => ({ ...c, phone: c.mobile || c.phone || '' })));
        }
      } catch (error) {
        // Silently fail - customer search is optional
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.phone || c.mobile || '').includes(searchTerm)
  );

  if (selectedCustomer) return null; // Handled in CartPanel preview

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-on-surface-variant" />
          </div>
          <input
            type="text"
            placeholder={t('pos.customerSelection.searchCustomer')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="block w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
          />
          
          {isOpen && (searchTerm.length > 0 || customers.length > 0) && (
            <div className="absolute z-50 w-full mt-2 bg-surface border border-outline-variant/30 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-center text-on-surface-variant">{t('pos.customerSelection.loading')}</div>
              ) : filteredCustomers.length > 0 ? (
                <ul className="py-2">
                  {filteredCustomers.map(customer => (
                    <li 
                      key={customer._id}
                      onClick={() => {
                        setSelectedCustomer({ ...customer, phone: customer.phone || '' });
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 hover:bg-primary/5 cursor-pointer flex flex-col"
                    >
                      <span className="text-sm font-bold text-on-surface">{customer.name}</span>
                      <span className="text-xs text-on-surface-variant">{customer.phone}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-center text-on-surface-variant">
                  {t('pos.customerSelection.noCustomers')} 
                  <button 
                    onClick={() => { setIsOpen(false); setIsCreateOpen(true); }}
                    className="text-primary font-bold ml-1 hover:underline"
                  >
                    Add New
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0 h-10 w-10 border-outline-variant/30 text-primary hover:bg-primary/5"
          onClick={() => setIsCreateOpen(true)}
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      {isCreateOpen && (
        <CustomerCreateModal 
          onClose={() => setIsCreateOpen(false)}
          onSuccess={(newCustomer) => {
            setIsCreateOpen(false);
            const formatted = { ...newCustomer, phone: newCustomer.mobile };
            setCustomers(prev => [...prev, formatted]);
            setSelectedCustomer(formatted);
          }}
        />
      )}
    </div>
  );
}
