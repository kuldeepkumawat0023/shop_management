'use client';

import React from 'react';
import { GlassCard } from '@/components/common/Card';
import {
    Calendar, ChevronDown, Wallet,
    ArrowUp, ArrowDown, ShoppingBag, LineChart as LineChartIcon, Users,
    Package, AlertTriangle, Receipt, CreditCard, Activity,
    Bell, CheckCircle2, Clock, User, Truck, UserPlus
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { StatsCard } from '@/components/common/StatsCard';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '@/lib/services/dashboard.services';
import toast from 'react-hot-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import CalendarWidget from './CalendarWidget';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardView() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            if (!user?.shopId) {
                setLoading(false);
                return;
            }
            try {
                const response = await dashboardService.getStats();
                setStats(response.data || response);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user?.shopId]);

    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

    return (
        <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full min-w-0">
            <div className="w-full space-y-6 flex-1">

                {/* Main Hero Header */}
                <div className="gradient-button p-6 md:p-8 text-on-primary relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl mb-6">
                    {/* Decorative Background */}
                    <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                        <svg className="w-full h-full transform translate-x-1/4 -translate-y-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.7,-73.4C55.9,-67.8,67.6,-57.4,75.9,-44.6C84.2,-31.8,89.1,-15.9,88.4,-0.4C87.7,15.1,81.4,30.2,71.5,42.5C61.6,54.8,48.1,64.3,33.5,70.6C18.9,76.9,3.1,80,-12.3,78.7C-27.7,77.4,-42.7,71.7,-54.6,61.8C-66.5,51.9,-75.3,37.8,-80.4,22.4C-85.5,7,-86.9,-9.7,-81.8,-24.5C-76.7,-39.3,-65.1,-52.2,-51,-59.8C-36.9,-67.4,-20.3,-69.7,-4.3,-62.4C11.7,-55.1,29.5,-79,42.7,-73.4Z" fill="#FFFFFF" transform="translate(100 100) scale(1.1)"></path>
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                            {t('dashboard.welcome')}, {user?.fullname?.split(' ')[0] || 'User'} <span className="text-2xl">👋</span>
                        </h2>
                        <p className="text-white/80 text-base">
                            {t('dashboard.welcomeDesc')}
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white/30 transition-colors">
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold text-sm">{today}</span>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatsCard
                        title={t("dashboard.totalRevenue")}
                        value={formatCurrency(stats?.kpis?.revenue?.value)}
                        icon={ShoppingBag}
                        colorTheme="primary"
                        trend={`${stats?.kpis?.revenue?.trend}%`}
                        trendDirection={stats?.kpis?.revenue?.trend >= 0 ? "up" : "down"}
                        trendLabel={t("dashboard.vsYesterday")}
                    />

                    <StatsCard
                        title={t("dashboard.totalOrders")}
                        value={stats?.kpis?.orders?.value?.toString() || "0"}
                        icon={Receipt}
                        colorTheme="secondary"
                        trend={`${stats?.kpis?.orders?.trend}%`}
                        trendDirection={stats?.kpis?.orders?.trend >= 0 ? "up" : "down"}
                        trendLabel={t("dashboard.vsYesterday")}
                    />

                    <StatsCard
                        title={t("dashboard.totalProfit")}
                        value={formatCurrency(stats?.kpis?.profit?.value)}
                        icon={LineChartIcon}
                        colorTheme="success"
                        trend={`${stats?.kpis?.profit?.trend}%`}
                        trendDirection={stats?.kpis?.profit?.trend >= 0 ? "up" : "down"}
                        trendLabel={t("dashboard.vsYesterday")}
                    />

                    <StatsCard
                        title={t("dashboard.totalCustomers")}
                        value={stats?.kpis?.customers?.value?.toString() || "0"}
                        icon={Users}
                        colorTheme="warning"
                        trend={`${stats?.kpis?.customers?.trend}%`}
                        trendDirection={stats?.kpis?.customers?.trend >= 0 ? "up" : "down"}
                        trendLabel={t("dashboard.vsYesterday")}
                    />

                    <StatsCard
                        title={t("dashboard.totalProducts")}
                        value={stats?.kpis?.products?.value?.toString() || "0"}
                        icon={Package}
                        colorTheme="primary"
                        trend="0%"
                        trendDirection="up"
                        trendLabel=""
                    />

                    <StatsCard
                        title={t("dashboard.lowStockItems")}
                        value={stats?.inventory?.lowStock?.count?.toString() || "0"}
                        icon={AlertTriangle}
                        colorTheme="error"
                        trend=""
                        trendDirection="down"
                        trendLabel=""
                    />

                    <StatsCard
                        title={t("dashboard.totalExpenses")}
                        value={formatCurrency(stats?.kpis?.expenses?.value)}
                        icon={Wallet}
                        colorTheme="warning"
                        trend={`${stats?.kpis?.expenses?.trend}%`}
                        trendDirection={stats?.kpis?.expenses?.trend >= 0 ? "up" : "down"}
                        trendLabel={t("dashboard.vsYesterday")}
                    />
                </div>

                {/* Analytics & Revenue Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Analytics Chart */}
                    <GlassCard className="lg:col-span-2 p-6 flex flex-col border-outline-variant/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">{t('dashboard.salesAnalytics')}</h3>
                            <div className="flex items-center gap-2 border border-outline-variant/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-surface-container-low text-xs font-medium text-on-surface-variant">
                                {t('dashboard.thisYear')} <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mb-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                <span className="text-on-surface-variant">{t('dashboard.thisYear')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border-2 border-dashed border-blue-300 bg-transparent"></span>
                                <span className="text-muted-foreground text-blue-300/80">{t('dashboard.lastYear')}</span>
                            </div>
                        </div>

                        <div className="h-[250px] w-full mt-4 text-xs">
                            {stats?.analytics && stats.analytics.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#8b8d97', fontSize: 10 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#8b8d97', fontSize: 10 }}
                                            tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                                            labelStyle={{ color: '#8b8d97', marginBottom: '4px' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="currentYear"
                                            name={t('dashboard.thisYear')}
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="lastYear"
                                            name={t('dashboard.lastYear')}
                                            stroke="#93c5fd"
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                            dot={{ r: 3, fill: '#93c5fd', strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No analytics data available
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Revenue Breakdown */}
                    <GlassCard className="p-6 flex flex-col border-outline-variant/20 shadow-sm">
                        <h3 className="text-base font-bold text-on-surface mb-6">{t('dashboard.revenueBreakdown')}</h3>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-full h-48 relative mb-2">
                                {stats?.revenueBreakdown && stats.revenueBreakdown.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.revenueBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {stats.revenueBreakdown.map((entry: any, index: number) => {
                                                    const colors = ['#10b981', '#2563eb', '#0ea5e9', '#f59e0b', '#8b5cf6'];
                                                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                })}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center border-[12px] border-surface rounded-full"></div>
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="font-bold text-lg text-on-surface">{formatCurrency(stats?.revenueBreakdown?.reduce((acc: number, item: any) => acc + (item.value || 0), 0) || 0)}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{t('dashboard.total')}</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-4">
                                {stats?.revenueBreakdown?.map((item: any, idx: number) => {
                                    const colors = ['bg-success', 'bg-primary', 'bg-secondary', 'bg-warning', 'bg-purple-500'];
                                    return (
                                        <div key={idx} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`}></span>
                                                <span className="text-on-surface-variant font-medium">
                                                    {t(`dashboard.${item?.name?.toLowerCase().replace(/\s+/g, '') || 'unknown'}`, { defaultValue: item?.name || 'Unknown' })}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className="font-semibold text-on-surface">{formatCurrency(item.value)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Inventory Status & Top Selling Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inventory Status */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <h3 className="text-base font-bold text-on-surface mb-6">{t('dashboard.inventoryStatus')}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full">

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-success" />
                                    <span className="text-xs font-semibold text-on-surface-variant">{t('dashboard.inStock')}</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">{stats?.inventory?.inStock?.percent}%</h4>
                                    <div className="w-full h-1.5 bg-outline-variant/30 rounded-full mb-1">
                                        <div className="h-full bg-success rounded-full" style={{ width: `${stats?.inventory?.inStock?.percent}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{stats?.inventory?.inStock?.count} {t("dashboard.items")}</span>
                                </div>
                            </div>

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-4 h-4 text-warning" />
                                    <span className="text-xs font-semibold text-on-surface-variant">{t('dashboard.lowStockItems')}</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">{stats?.inventory?.lowStock?.percent}%</h4>
                                    <div className="w-full h-1.5 bg-outline-variant/30 rounded-full mb-1">
                                        <div className="h-full bg-warning rounded-full" style={{ width: `${stats?.inventory?.lowStock?.percent}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{stats?.inventory?.lowStock?.count} {t("dashboard.items")}</span>
                                </div>
                            </div>

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-error opacity-60" />
                                    <span className="text-xs font-semibold text-on-surface-variant">{t('dashboard.outOfStock')}</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">{stats?.inventory?.outOfStock?.percent}%</h4>
                                    <div className="w-full h-1.5 bg-outline-variant/30 rounded-full mb-1">
                                        <div className="h-full bg-error rounded-full" style={{ width: `${stats?.inventory?.outOfStock?.percent}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{stats?.inventory?.outOfStock?.count} {t("dashboard.items")}</span>
                                </div>
                            </div>

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <LineChartIcon className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-on-surface-variant">{t('dashboard.totalProducts')}</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">{stats?.inventory?.total}</h4>
                                    <div className="w-full h-1.5 bg-transparent rounded-full mb-1"></div>
                                    <span className="text-[10px] text-muted-foreground">{t('dashboard.allProducts')}</span>
                                </div>
                            </div>

                        </div>
                    </GlassCard>

                    {/* Top Selling Products */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">{t('dashboard.topSellingProducts')}</h3>
                            <div className="flex items-center gap-2 border border-outline-variant/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-surface-container-low text-xs font-medium text-on-surface-variant">
                                {t('dashboard.thisMonth')} <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            {(stats?.topSelling || []).map((product: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-on-surface-variant w-32 truncate">{product.name}</span>
                                    <div className="flex-1 h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${product.percent}%` }}></div>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface w-8 text-right">{product.count}</span>
                                </div>
                            ))}
                            {stats?.topSelling?.length === 0 && <p className="text-xs text-muted-foreground text-center">No recent sales data</p>}
                        </div>
                    </GlassCard>
                </div>

                {/* Recent Sales & Low Stock Alerts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Recent Sales */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">{t('dashboard.recentSales')}</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewAll')}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[600px] whitespace-nowrap">
                                <thead>
                                    <tr className="text-muted-foreground border-b border-outline-variant/20">
                                        <th className="pb-3 font-medium text-xs">{t('dashboard.invoice')}</th>
                                        <th className="pb-3 font-medium text-xs">{t('dashboard.customer')}</th>
                                        <th className="pb-3 font-medium text-xs">{t('dashboard.amount')}</th>
                                        <th className="pb-3 font-medium text-xs">{t('dashboard.payment')}</th>
                                        <th className="pb-3 font-medium text-xs">{t('dashboard.status')}</th>
                                        <th className="pb-3 font-medium text-xs">{t('dashboard.time')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {(stats?.recentSales || []).map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                                            <td className="py-3 text-primary font-medium text-xs">{row.invoiceNumber}</td>
                                            <td className="py-3 text-on-surface text-xs">{row.customer?.name || 'Walk-in'}</td>
                                            <td className="py-3 text-on-surface font-medium text-xs">{formatCurrency(row.netAmount)}</td>
                                            <td className="py-3 text-on-surface-variant text-xs">{row.paymentMethod}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.paymentStatus === 'Paid' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                                                    {row.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 text-muted-foreground text-xs">{new Date(row.saleDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                                        </tr>
                                    ))}
                                    {stats?.recentSales?.length === 0 && (
                                        <tr><td colSpan={6} className="py-6 text-center text-xs text-muted-foreground">No recent sales found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    {/* Low Stock Alerts */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">{t('dashboard.lowStockAlerts')}</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewAll')}</span>
                        </div>
                        <div className="space-y-4">
                            {(stats?.lowStockAlerts || []).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between border-b border-outline-variant/10 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${item.currentStock === 0 ? 'bg-error/20' : 'bg-warning/20'} flex items-center justify-center`}>
                                            <Package className="w-4 h-4 text-on-surface" />
                                        </div>
                                        <span className="text-sm font-medium text-on-surface">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-error text-xs font-bold">{item.currentStock} {t('dashboard.left')}</span>
                                        <button className="text-xs font-bold text-error border border-error/30 hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors">
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {stats?.lowStockAlerts?.length === 0 && <p className="text-xs text-muted-foreground text-center">No low stock items</p>}
                        </div>
                    </GlassCard>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-on-surface mb-1">{t('dashboard.customerDue')}</h4>
                            <p className="text-xl font-black text-on-surface mb-1">{formatCurrency(stats?.totalPendingPayments)}</p>
                            <p className="text-[10px] text-muted-foreground mb-3">{t('dashboard.totalOutstanding')}</p>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewAll')}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                            <User className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-on-surface mb-1">{t('dashboard.inventoryValuation')}</h4>
                            <p className="text-xl font-black text-on-surface mb-1">{formatCurrency(stats?.inventoryValuation)}</p>
                            <p className="text-[10px] text-muted-foreground mb-3">Estimated Value</p>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewAll')}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Package className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-on-surface mb-2">{t('dashboard.profitSummary')}</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Today</span>
                                    <span className="font-semibold">{formatCurrency(stats?.todaysNetProfit || (stats?.todaysProfit - stats?.todaysExpenses))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> This Month</span>
                                    <span className="font-semibold">{formatCurrency(stats?.thisMonthNetProfit || (stats?.thisMonthProfit - stats?.thisMonthExpenses))}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success ml-4">
                            <LineChartIcon className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-on-surface mb-1">{t('dashboard.expenseSummary')}</h4>
                            <p className="text-xl font-black text-on-surface mb-1">{formatCurrency(stats?.thisMonthExpenses)}</p>
                            <p className="text-[10px] text-muted-foreground mb-3">{t('dashboard.thisMonth')}</p>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewDetails')}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </GlassCard>
                </div>

                {/* Bottom Row: Timeline, Calendar, Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Timeline */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-base font-bold text-on-surface">{t('dashboard.activityTimeline')}</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewAll')}</span>
                        </div>
                        <div className="relative pl-3 space-y-6">
                            <div className="absolute left-[17px] top-2 bottom-2 w-px bg-outline-variant/30"></div>
                            
                            {stats?.activities && stats.activities.length > 0 ? (
                                stats.activities.map((activity: any) => (
                                    <div key={activity.id} className="relative flex gap-4">
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 ring-4 ring-surface",
                                            activity.color === 'blue' ? 'bg-primary' :
                                            activity.color === 'red' ? 'bg-error' :
                                            activity.color === 'green' ? 'bg-success' : 'bg-warning'
                                        )}></div>
                                        <div className="flex-1 flex justify-between text-xs">
                                            <span className="text-on-surface-variant font-medium">
                                                {activity.type === 'sale' ? (
                                                    <>{t('dashboard.paymentOf')} <span className="font-bold text-success">{formatCurrency(activity.data.amount)}</span> {t('dashboard.receivedFrom')} {activity.data.customer}</>
                                                ) : activity.type === 'expense' ? (
                                                    <>{t('dashboard.expenseOf')} <span className="font-bold text-error">{formatCurrency(activity.data.amount)}</span> {t('dashboard.addedFor')} {activity.data.title}</>
                                                ) : (
                                                    activity.title
                                                )}
                                            </span>
                                            <span className="text-muted-foreground shrink-0">{format(new Date(activity.timestamp), 'hh:mm a')}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-muted-foreground py-4 text-center">No recent activities</div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Simple Static Calendar */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <CalendarWidget />
                    </GlassCard>

                    {/* Notifications */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">{t('dashboard.notifications')}</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">{t('dashboard.viewAll')}</span>
                        </div>
                        <div className="space-y-4">
                            {stats?.notifications && stats.notifications.length > 0 ? (
                                stats.notifications.map((notif: any) => (
                                    <div key={notif.id} className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            notif.iconType === 'warning' ? "bg-error/10 text-error" : 
                                            notif.iconType === 'success' ? "bg-success/10 text-success" : 
                                            "bg-primary/10 text-primary"
                                        )}>
                                            {notif.iconType === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                                             notif.iconType === 'success' ? <ShoppingBag className="w-3.5 h-3.5" /> : 
                                             <Bell className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-on-surface-variant">
                                                {notif.type === 'low_stock' ? (
                                                    <>{t('dashboard.lowStockAlertFor')} <span className="font-bold">{notif.data.name}</span> ({notif.data.stock} {t('dashboard.left')})</>
                                                ) : notif.type === 'new_order' ? (
                                                    <>{t('dashboard.newOrder')} <span className="font-bold text-on-surface">#{notif.data.invoice}</span> {t('dashboard.received')}</>
                                                ) : (
                                                    notif.message
                                                )}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground shrink-0 text-right whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-muted-foreground py-4 text-center">No new notifications</div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* Spacer */}
                <div className="h-8"></div>
            </div>
        </div>
    );
}
