'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Phone, Mail, MapPin, Building, Edit, Trash2, ShoppingBag, IndianRupee, History, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { customerService, CustomerData } from '@/lib/services/customer.services';
import { saleService, SaleData } from '@/lib/services/sale.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ActionGuard from '@/components/auth/ActionGuard';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function CustomerDetailView({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [recentOrders, setRecentOrders] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [custRes, salesRes] = await Promise.all([
          customerService.getCustomerById(id),
          saleService.getSales()
        ]);

        if (custRes.success && custRes.data) {
          setCustomer(custRes.data);
        }

        if (salesRes.success && salesRes.data) {
          // Filter sales by customerId
          const customerSales = salesRes.data.filter(s => 
            (typeof s.customerId === 'object' ? s.customerId?._id === id : s.customerId === id)
          ).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          
          setRecentOrders(customerSales);
        }
      } catch (error) {
        toast.error(t('parties.customerDetailView.loadError'), { id: 'failed-to-load-customer-detail' });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      const res = await customerService.deleteCustomer(id);
      if (res.success) {
        toast.success(t('parties.customerDetailView.deletedSuccess'));
        router.push('/customers');
      } else {
        toast.error(res.message || t('parties.customerDetailView.deleteFailed'));
      }
    } catch (error) {
      toast.error(t('parties.customerDetailView.deleteFailed'), { id: 'failed-to-delete-customer' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <DetailViewSkeleton />;
  if (!customer) return <div className="p-8 text-center">{t('parties.customerDetailView.customerNotFound')}</div>;

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background w-full min-w-0">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">{customer.name}</h2>
                <StatusBadge status={customer.isActive !== false ? "Active" : "Inactive"} />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">{t('parties.customerDetailView.customerId')}{customer._id?.substring(0, 8)} • {t('parties.customerDetailView.joined')}{new Date(customer.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ActionGuard permission="customers.update">
              <Link href={`/customers/${id}/edit`}>
                <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('parties.customerDetailView.editProfile')}</span>
                </Button>
              </Link>
            </ActionGuard>
            <ActionGuard permission="customers.delete">
              <Button onClick={() => setShowDeleteModal(true)} variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('parties.customerDetailView.delete')}</span>
              </Button>
            </ActionGuard>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <IndianRupee className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('parties.customerDetailView.totalSpent')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹{recentOrders.reduce((sum, order) => sum + (order.netAmount || 0), 0).toLocaleString()}</p>
            <p className="text-sm text-primary font-bold">{t('parties.customerDetailView.lifetimeSales')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <ShoppingBag className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('parties.customerDetailView.totalOrders')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">{recentOrders.length}</p>
            <p className="text-sm text-on-surface-variant font-medium">{t('parties.customerDetailView.lastOrder')}{recentOrders.length > 0 ? new Date(recentOrders[0].createdAt || '').toLocaleDateString() : t('parties.customerDetailView.na')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('parties.customerDetailView.outstandingBalance')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹{(customer.dueAmount || 0).toLocaleString()}</p>
            <p className="text-sm text-success font-bold">{t('parties.customerDetailView.creditLimit')}₹{(customer.creditLimit || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <User className="w-5 h-5 text-primary" />
                {t('parties.customerDetailView.contactDetails')}
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parties.customerDetailView.email')}</span>
                    <a href={`mailto:${customer.email || ''}`} className="font-semibold text-primary hover:underline">{customer.email || t('parties.customerDetailView.na')}</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parties.customerDetailView.phone')}</span>
                    <a href={`tel:${customer.mobile || ''}`} className="font-semibold text-on-surface">{customer.mobile || t('parties.customerDetailView.na')}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parties.customerDetailView.company')}</span>
                    <span className="font-semibold text-on-surface">{customer.company || t('parties.customerDetailView.na')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('parties.customerDetailView.address')}</span>
                    <span className="font-semibold text-on-surface whitespace-pre-wrap">{customer.address || t('parties.customerDetailView.na')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">{t('parties.customerDetailView.notes')}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {customer.notes || t('parties.customerDetailView.na')}
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  {t('parties.customerDetailView.recentActivity')}
                </h3>
                <Link href="/sales">
                  <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">{t('parties.customerDetailView.viewAll')}</Button>
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{order.invoiceNumber}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{new Date(order.createdAt || '').toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-black text-on-surface">₹{(order.netAmount || 0).toLocaleString()}</p>
                          <StatusBadge status={order.paymentStatus || 'Paid'} />
                        </div>
                        <Link href={`/sales/${order._id}`}>
                          <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">{t('parties.customerDetailView.noRecentActivity')}</p>
                  <p className="text-sm text-on-surface-variant">{t('parties.customerDetailView.noOrdersMsg')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        itemName={customer.name || t('common.item')}
      />
    </div>
  );
}
