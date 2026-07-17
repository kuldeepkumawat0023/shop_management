'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Phone, Mail, MapPin, Building, Edit, Trash2, ShoppingCart, IndianRupee, History, ReceiptText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supplierService } from '@/lib/services/supplier.services';
import { purchaseService, PurchaseData } from '@/lib/services/purchase.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ActionGuard from '@/components/auth/ActionGuard';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function SupplierDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [supplier, setSupplier] = useState<any | null>(null);
  const [recentPOs, setRecentPOs] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [supRes, purRes] = await Promise.all([
          supplierService.getSuppliers(),
          purchaseService.getPurchases()
        ]);

        if (supRes.success && supRes.data) {
          const found = supRes.data.find((s: any) => s._id === id);
          if (found) setSupplier(found);
        }

        if (purRes.success && purRes.data) {
          const supplierPurchases = purRes.data.filter(p => 
            (typeof p.supplierId === 'object' ? p.supplierId?._id === id : p.supplierId === id)
          ).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          
          setRecentPOs(supplierPurchases);
        }
      } catch (error) {
        toast.error('Failed to load supplier details', { id: 'failed-to-load-supplier-detail' });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      const res = await supplierService.deleteSupplier(id);
      if (res.success) {
        toast.success('Supplier deleted successfully');
        router.push('/suppliers');
      } else {
        toast.error(res.message || 'Failed to delete supplier');
      }
    } catch (error) {
      toast.error('Failed to delete supplier', { id: 'failed-to-delete-supplier' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <DetailViewSkeleton />;
  if (!supplier) return <div className="p-8 text-center">{t('suppliers.supplierDetail.notFound')}</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full ">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">{supplier.name}</h2>
                <StatusBadge status={supplier.isActive !== false ? "Active" : "Inactive"} />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">{t('suppliers.supplierDetail.supplierId')} {supplier._id?.substring(0, 8)} • {t('suppliers.supplierDetail.onboarded')} {new Date(supplier.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ActionGuard permission="suppliers.update">
              <Link href={`/suppliers/${id}/edit`}>
                <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('suppliers.supplierDetail.editProfile')}</span>
                </Button>
              </Link>
            </ActionGuard>
            <ActionGuard permission="suppliers.delete">
              <Button onClick={() => setShowDeleteModal(true)} variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('suppliers.supplierDetail.delete')}</span>
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
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('suppliers.supplierDetail.totalSourced')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹{recentPOs.reduce((sum, po) => sum + (po.netAmount || 0), 0).toLocaleString()}</p>
            <p className="text-sm text-primary font-bold">{t('suppliers.supplierDetail.lifetimeValue')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <ShoppingCart className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('suppliers.supplierDetail.totalPos')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">{recentPOs.length}</p>
            <p className="text-sm text-on-surface-variant font-medium">{t('suppliers.supplierDetail.lastPoOn')} {recentPOs.length > 0 ? new Date(recentPOs[0].createdAt || '').toLocaleDateString() : t('suppliers.suppliersView.na')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('suppliers.supplierDetail.outstandingPayables')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹{(supplier.balance || 0).toLocaleString()}</p>
            <p className="text-sm text-warning font-bold">{t('suppliers.supplierDetail.totalBalance')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <Building className="w-5 h-5 text-primary" />
                {t('suppliers.supplierDetail.businessDetails')}
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('suppliers.supplierDetail.contactPerson')}</span>
                    <span className="font-semibold text-on-surface">{supplier.contactPerson || t('suppliers.suppliersView.na')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('suppliers.supplierDetail.email')}</span>
                    <a href={`mailto:${supplier.email || ''}`} className="font-semibold text-primary hover:underline">{supplier.email || t('suppliers.suppliersView.na')}</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('suppliers.supplierDetail.phone')}</span>
                    <a href={`tel:${supplier.mobile || ''}`} className="font-semibold text-on-surface">{supplier.mobile || t('suppliers.suppliersView.na')}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <ReceiptText className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('suppliers.supplierDetail.gstin')}</span>
                    <span className="font-semibold text-on-surface font-mono">{supplier.gstNumber || t('suppliers.suppliersView.na')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('suppliers.supplierDetail.address')}</span>
                    <span className="font-semibold text-on-surface whitespace-pre-wrap">{supplier.address || t('suppliers.suppliersView.na')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">{t('suppliers.supplierDetail.paymentNotes')}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('suppliers.supplierDetail.paymentTerms')}</span>
                  <span className="text-sm font-bold text-on-surface">Net 30</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-2 border-t border-outline-variant/10 pt-2">
                  {supplier.notes || t('suppliers.suppliersView.na')}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  {t('suppliers.supplierDetail.recentPos')}
                </h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">{t('suppliers.supplierDetail.viewAll')}</Button>
              </div>

              {recentPOs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentPOs.slice(0, 5).map((po) => (
                    <div key={po._id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{po.invoiceNumber}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{new Date(po.createdAt || '').toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-black text-on-surface">₹{(po.netAmount || 0).toLocaleString()}</p>
                          <StatusBadge status={po.paymentStatus === 'Paid' ? 'Delivered' : po.paymentStatus} />
                        </div>
                        <Button variant="ghost" size="icon" className="text-on-surface-variant">
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">{t('suppliers.supplierDetail.noRecentPos')}</p>
                  <p className="text-sm text-on-surface-variant">{t('suppliers.supplierDetail.noOrdersYet')}</p>
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
        itemName={supplier.name || t('common.item')}
      />
    </div>
  );
}
