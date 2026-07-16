const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'dashboard', 'dashboard', 'DashboardView.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add translation hook
if (!content.includes("import { useTranslation }")) {
  content = content.replace(
    "import { StatsCard } from '@/components/common/StatsCard';",
    "import { StatsCard } from '@/components/common/StatsCard';\nimport { useTranslation } from 'react-i18next';"
  );
}

if (!content.includes("const { t } = useTranslation();")) {
  content = content.replace(
    "export default function DashboardView() {",
    "export default function DashboardView() {\n    const { t } = useTranslation();"
  );
}

// Layout responsiveness fixes
content = content.replace('<table className="w-full text-left text-sm">', '<table className="w-full text-left text-sm min-w-[600px] whitespace-nowrap">');

// Simple Replacements
const replacements = [
  ['Dashboard Overview 👋', "{t('dashboard.overview')} 👋"],
  ["Welcome back, Raj! Here's what's happening with your business today.", "{t('dashboard.welcome')}, Raj! {t('dashboard.welcomeDesc')}"],
  ['>Filter<', ">{t('dashboard.filter')}<"],
  ['>Export<', ">{t('dashboard.export')}<"],
  ['title="Total Revenue"', 'title={t("dashboard.totalRevenue")}'],
  ['trendLabel="vs yesterday"', 'trendLabel={t("dashboard.vsYesterday")}'],
  ['title="Total Orders"', 'title={t("dashboard.totalOrders")}'],
  ['title="Total Profit"', 'title={t("dashboard.totalProfit")}'],
  ['title="Total Customers"', 'title={t("dashboard.totalCustomers")}'],
  ['title="Total Products"', 'title={t("dashboard.totalProducts")}'],
  ['title="Low Stock Items"', 'title={t("dashboard.lowStockItems")}'],
  ['title="Total Expenses"', 'title={t("dashboard.totalExpenses")}'],
  ['>Sales Analytics<', ">{t('dashboard.salesAnalytics')}<"],
  ['This Year', "{t('dashboard.thisYear')}"],
  ['Last Year', "{t('dashboard.lastYear')}"],
  ['>Revenue Breakdown<', ">{t('dashboard.revenueBreakdown')}<"],
  ['>Total<', ">{t('dashboard.total')}<"],
  ['>Cash<', ">{t('dashboard.cash')}<"],
  ['>UPI<', ">{t('dashboard.upi')}<"],
  ['>Card<', ">{t('dashboard.card')}<"],
  ['>Bank Transfer<', ">{t('dashboard.bankTransfer')}<"],
  ['>Inventory Status<', ">{t('dashboard.inventoryStatus')}<"],
  ['>In Stock<', ">{t('dashboard.inStock')}<"],
  ['>Out of Stock<', ">{t('dashboard.outOfStock')}<"],
  ['>Total Items<', ">{t('dashboard.totalItems')}<"],
  ['>All Products<', ">{t('dashboard.allProducts')}<"],
  ['>Top Selling Products<', ">{t('dashboard.topSellingProducts')}<"],
  ['This Month', "{t('dashboard.thisMonth')}"],
  ['>Recent Sales<', ">{t('dashboard.recentSales')}<"],
  ['>View All<', ">{t('dashboard.viewAll')}<"],
  ['>Invoice<', ">{t('dashboard.invoice')}<"],
  ['>Customer<', ">{t('dashboard.customer')}<"],
  ['>Amount<', ">{t('dashboard.amount')}<"],
  ['>Payment<', ">{t('dashboard.payment')}<"],
  ['>Status<', ">{t('dashboard.status')}<"],
  ['>Time<', ">{t('dashboard.time')}<"],
  ['>Completed<', ">{t('dashboard.completed')}<"],
  ['>Low Stock Alerts<', ">{t('dashboard.lowStockAlerts')}<"],
  [' Left<', " {t('dashboard.left')}<"],
  ['>Order Now<', ">{t('dashboard.orderNow')}<"],
  ['>Customer Due<', ">{t('dashboard.customerDue')}<"],
  ['>Total Outstanding<', ">{t('dashboard.totalOutstanding')}<"],
  ['>Supplier Due<', ">{t('dashboard.supplierDue')}<"],
  ['>Payment Status<', ">{t('dashboard.paymentStatus')}<"],
  ['> Paid<', "> {t('dashboard.paid')}<"],
  ['> Pending<', "> {t('dashboard.pending')}<"],
  ['> Overdue<', "> {t('dashboard.overdue')}<"],
  ['>Expense Summary<', ">{t('dashboard.expenseSummary')}<"],
  ['>View Details<', ">{t('dashboard.viewDetails')}<"],
  ['>Activity Timeline<', ">{t('dashboard.activityTimeline')}<"],
  ['added by', "{t('dashboard.addedBy')}"],
  ['added<', "{t('dashboard.added')}<"],
  ['Payment of', "{t('dashboard.paymentOf')}"],
  ['received from', "{t('dashboard.receivedFrom')}"],
  ['Expense of', "{t('dashboard.expenseOf')}"],
  ['added for', "{t('dashboard.addedFor')}"],
  ['>Calendar<', ">{t('dashboard.calendar')}<"],
  ['>Notifications<', ">{t('dashboard.notifications')}<"],
  ['>Sun<', ">{t('dashboard.days.sun')}<"],
  ['>Mon<', ">{t('dashboard.days.mon')}<"],
  ['>Tue<', ">{t('dashboard.days.tue')}<"],
  ['>Wed<', ">{t('dashboard.days.wed')}<"],
  ['>Thu<', ">{t('dashboard.days.thu')}<"],
  ['>Fri<', ">{t('dashboard.days.fri')}<"],
  ['>Sat<', ">{t('dashboard.days.sat')}<"],
  ['1,041 Items', '1,041 {t("dashboard.items")}'],
  ['142 Items', '142 {t("dashboard.items")}'],
  ['57 Items', '57 {t("dashboard.items")}']
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync(file, content);
console.log("DashboardView.tsx updated.");
