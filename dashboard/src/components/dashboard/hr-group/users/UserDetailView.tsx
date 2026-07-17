'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Mail, Edit, Trash2, ShieldAlert, Key, MonitorPlay, CalendarClock, History, CheckCircle2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { userService } from '@/lib/services/user.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import Link from 'next/link';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function UserDetailView() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const res = await userService.getProfile(id);
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (error) {
        toast.error(t('hr.userDetail.loadError'), { id: 'failed-to-fetch-user-details' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      const res = await userService.deleteProfile(id);
      if (res.success || (res as any).status === 200) {
        toast.success(t('hr.userDetail.userSuspended'));
        router.push('/users');
      } else {
        toast.error((res as any).message || t('hr.userDetail.suspendFailed'));
      }
    } catch (error) {
      toast.error(t('hr.userDetail.suspendFailed'), { id: 'failed-to-suspend-user' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <ViewPageSkeleton />;
  if (!user) return <div className="p-8 text-center text-on-surface-variant">{t('hr.userDetail.notFound')}</div>;

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
                <h2 className="text-2xl font-black text-on-surface tracking-tight">{user.fullname}</h2>
                <StatusBadge status={user.isActive === false ? t('hr.userDetail.inactive') : (user.isPending ? t('hr.userDetail.pending') : t('hr.userDetail.active'))} />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">
                {user.role} {user.shopId ? `• ${user.shopId.name || 'Shop'}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ActionGuard permission="users.update">
              <Link href={`/users/${id}/edit`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('hr.userDetail.editAccount')}</span>
                </Button>
              </Link>
            </ActionGuard>
            <ActionGuard permission="users.delete">
              <Button variant="outline" onClick={() => setShowDeleteModal(true)} className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('hr.userDetail.suspendUser')}</span>
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
              <CalendarClock className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('hr.userDetail.accountAge')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">
              {user.createdAt ? (() => {
                const diff = (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
                return `${diff.toFixed(1)} ${t('hr.userDetail.yrs')}`;
              })() : 'N/A'}
            </p>
            <p className="text-sm text-primary font-bold">{t('hr.userDetail.created')} {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MonitorPlay className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('hr.userDetail.totalLogins')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">--</p>
            <p className="text-sm text-on-surface-variant font-medium">{t('hr.userDetail.analyticsPending')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('hr.userDetail.lastActive')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">--</p>
            <p className="text-sm text-warning font-bold">{t('hr.userDetail.analyticsPending')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <User className="w-5 h-5 text-primary" />
                Profile Details
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('hr.userDetail.phone')}</span>
                    <span className="font-semibold text-on-surface">{user.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('hr.userDetail.email')}</span>
                    <a href={`mailto:${user.email}`} className="font-semibold text-primary hover:underline">{user.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('hr.userDetail.systemRole')}</span>
                    <span className="font-semibold text-on-surface">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/20 pb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Security Settings
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('hr.userDetail.twoFaAuth')}</span>
                  <span className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('hr.userDetail.lastPwdChange')}</span>
                  <span className="text-sm font-bold text-on-surface">{t('hr.userDetail.threeMonthsAgo')}</span>
                </div>
                <Button variant="outline" className="w-full mt-2 border-outline-variant/30 text-on-surface-variant text-sm h-9">
                  Send Password Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  System Activity Log
                </h3>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                  <History className="w-8 h-8 text-on-surface-variant/50" />
                </div>
                <p className="text-lg font-bold text-on-surface mb-1">{t('hr.userDetail.noActivityRecorded')}</p>
                <p className="text-sm text-on-surface-variant">{t('hr.userDetail.noActivityMsg')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        itemName={user.fullname || t('common.item')}
      />
    </div>
  );
}
