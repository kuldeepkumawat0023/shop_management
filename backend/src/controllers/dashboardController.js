const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const SaleItem = require('../models/SaleItem');
const mongoose = require('mongoose');

// @desc    Get comprehensive dashboard metrics
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const shopId = req.scopedShopId;
    const matchStage = shopId ? { shopId: new mongoose.Types.ObjectId(shopId) } : {};
    
    // Dates
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // 1. Sales KPI (Today vs Yesterday)
    const salesAgg = await Sale.aggregate([
      { $match: matchStage },
      {
        $facet: {
          todays: [
            { $match: { saleDate: { $gte: startOfToday } } },
            { $group: { _id: null, revenue: { $sum: '$netAmount' }, profit: { $sum: '$totalProfit' }, orders: { $sum: 1 } } }
          ],
          yesterdays: [
            { $match: { saleDate: { $gte: startOfYesterday, $lt: startOfToday } } },
            { $group: { _id: null, revenue: { $sum: '$netAmount' }, profit: { $sum: '$totalProfit' }, orders: { $sum: 1 } } }
          ],
          revenueBreakdown: [
            { $match: { saleDate: { $gte: startOfMonth } } }, // This month's breakdown
            { $group: { _id: '$paymentMethod', amount: { $sum: '$netAmount' } } }
          ],
          monthlyAnalytics: [
             { $group: {
                _id: { year: { $year: "$saleDate" }, month: { $month: "$saleDate" } },
                revenue: { $sum: "$netAmount" }
             }}
          ],
          recentSales: [
            { $sort: { saleDate: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'customers', localField: 'customerId', foreignField: '_id', as: 'customer' } },
            { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
            { $project: { invoiceNumber: 1, netAmount: 1, paymentMethod: 1, paymentStatus: 1, saleDate: 1, 'customer.name': 1 } }
          ]
        }
      }
    ]);

    // 2. Expenses KPI (Today vs Yesterday)
    const expensesAgg = await Expense.aggregate([
      { $match: { ...matchStage, isActive: true } },
      {
        $facet: {
          todays: [
            { $match: { expenseDate: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          yesterdays: [
            { $match: { expenseDate: { $gte: startOfYesterday, $lt: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          recentExpenses: [
            { $sort: { expenseDate: -1 } },
            { $limit: 5 },
            { $project: { _id: 1, title: 1, amount: 1, expenseDate: 1, category: 1 } }
          ]
        }
      }
    ]);

    // 3. Customers KPI
    const totalCustomers = await Customer.countDocuments({ ...matchStage, isActive: true });
    const todaysCustomers = await Customer.countDocuments({ ...matchStage, createdAt: { $gte: startOfToday }, isActive: true });
    const yesterdaysCustomers = await Customer.countDocuments({ ...matchStage, createdAt: { $gte: startOfYesterday, $lt: startOfToday }, isActive: true });

    // 4. Products & Inventory
    const inventoryAgg = await Product.aggregate([
      { $match: { ...matchStage, isActive: true } },
      {
        $facet: {
          totals: [
            { $group: { 
                _id: null, 
                totalProducts: { $sum: 1 },
                inStock: { $sum: { $cond: [{ $gt: ['$currentStock', { $ifNull: ['$minStock', 5] }] }, 1, 0] } },
                lowStock: { $sum: { $cond: [
                  { $and: [
                    { $lte: ['$currentStock', { $ifNull: ['$minStock', 5] }] },
                    { $gt: ['$currentStock', 0] }
                  ] }, 1, 0] } },
                outOfStock: { $sum: { $cond: [{ $lte: ['$currentStock', 0] }, 1, 0] } }
            }}
          ],
          lowStockAlerts: [
            { $match: { $expr: { $and: [ 
                { $lte: [{ $ifNull: ['$currentStock', 0] }, { $ifNull: ['$minStock', 5] }] }, 
                { $gt: [{ $ifNull: ['$currentStock', 0] }, 0] } 
              ] } } 
            },
            { $project: { name: 1, currentStock: 1, minStock: 1 } },
            { $sort: { currentStock: 1 } },
            { $limit: 10 } 
          ]
        }
      }
    ]);

    // 5. Top Selling Products (This Month)
    const topSelling = await SaleItem.aggregate([
      { $match: matchStage },
      // Join with Sale to filter by date
      { $lookup: { from: 'sales', localField: 'saleId', foreignField: '_id', as: 'sale' } },
      { $unwind: '$sale' },
      { $match: { 'sale.saleDate': { $gte: startOfMonth } } },
      { $group: { _id: '$productId', totalQty: { $sum: '$quantity' } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { name: '$product.name', count: '$totalQty' } }
    ]);

    // --- Format Response ---
    const s = salesAgg[0] || {};
    const e = expensesAgg[0] || {};
    const inv = inventoryAgg[0] || {};
    
    const todaysSales = s.todays?.[0] || { revenue: 0, profit: 0, orders: 0 };
    const yesterdaysSales = s.yesterdays?.[0] || { revenue: 0, profit: 0, orders: 0 };
    
    const todaysExp = e.todays?.[0]?.total || 0;
    const yesterdaysExp = e.yesterdays?.[0]?.total || 0;

    const calculateTrend = (today, yesterday) => {
      if (yesterday === 0) return today > 0 ? 100 : 0;
      return Number((((today - yesterday) / yesterday) * 100).toFixed(1));
    };

    const invTotals = inv.totals?.[0] || { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
    const maxTopSell = topSelling.length > 0 ? Math.max(...topSelling.map(t => t.count)) : 1;

    // Monthly Analytics formatter
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const analytics = months.map((m, index) => {
      const monthNum = index + 1;
      const curYearData = s.monthlyAnalytics?.find(a => a._id.year === currentYear && a._id.month === monthNum);
      const lastYearData = s.monthlyAnalytics?.find(a => a._id.year === lastYear && a._id.month === monthNum);
      return {
        name: m,
        currentYear: curYearData ? curYearData.revenue : 0,
        lastYear: lastYearData ? lastYearData.revenue : 0
      };
    });

    const revenueBreakdownMap = {
      'Cash': 0, 'UPI': 0, 'Card': 0, 'Bank Transfer': 0, 'Multiple': 0, 'Credit': 0
    };
    s.revenueBreakdown?.forEach(b => {
      if (revenueBreakdownMap[b._id] !== undefined) revenueBreakdownMap[b._id] = b.amount;
    });

    const recentSalesList = s.recentSales || [];
    const recentExpensesList = e.recentExpenses || [];
    const lowStockList = inv.lowStockAlerts || [];

    // Map into Unified Activities
    const activities = [
      ...recentSalesList.map(sale => ({
        id: sale._id,
        type: 'sale',
        data: { amount: sale.netAmount, customer: sale.customer?.name || 'Customer' },
        timestamp: sale.saleDate,
        color: 'green'
      })),
      ...recentExpensesList.map(exp => ({
        id: exp._id,
        type: 'expense',
        data: { amount: exp.amount, title: exp.title },
        timestamp: exp.expenseDate,
        color: 'red'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    // Map into Unified Notifications
    const notifications = [
      ...lowStockList.map(item => ({
        id: item._id,
        type: 'low_stock',
        data: { name: item.name, stock: item.currentStock },
        timestamp: new Date(), // Using current time as alert time
        iconType: 'warning'
      })),
      ...recentSalesList.map(sale => ({
        id: sale._id,
        type: 'new_order',
        data: { invoice: sale.invoiceNumber },
        timestamp: sale.saleDate,
        iconType: 'success'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          revenue: { value: todaysSales.revenue, trend: calculateTrend(todaysSales.revenue, yesterdaysSales.revenue) },
          orders: { value: todaysSales.orders, trend: calculateTrend(todaysSales.orders, yesterdaysSales.orders) },
          profit: { value: todaysSales.profit, trend: calculateTrend(todaysSales.profit, yesterdaysSales.profit) },
          customers: { value: totalCustomers, trend: calculateTrend(todaysCustomers, yesterdaysCustomers) },
          products: { value: invTotals.totalProducts, trend: 0 },
          expenses: { value: todaysExp, trend: calculateTrend(todaysExp, yesterdaysExp) }
        },
        inventory: {
          total: invTotals.totalProducts,
          inStock: { count: invTotals.inStock, percent: invTotals.totalProducts ? Math.round((invTotals.inStock/invTotals.totalProducts)*100) : 0 },
          lowStock: { count: invTotals.lowStock, percent: invTotals.totalProducts ? Math.round((invTotals.lowStock/invTotals.totalProducts)*100) : 0 },
          outOfStock: { count: invTotals.outOfStock, percent: invTotals.totalProducts ? Math.round((invTotals.outOfStock/invTotals.totalProducts)*100) : 0 }
        },
        analytics,
        revenueBreakdown: [
          { name: 'Cash', value: revenueBreakdownMap['Cash'] },
          { name: 'UPI', value: revenueBreakdownMap['UPI'] },
          { name: 'Card', value: revenueBreakdownMap['Card'] },
          { name: 'Bank Transfer', value: revenueBreakdownMap['Bank Transfer'] }
        ],
        topSelling: topSelling.map(t => ({ name: t.name, count: t.count, percent: Math.round((t.count / maxTopSell) * 100) })),
        recentSales: recentSalesList,
        lowStockAlerts: lowStockList,
        activities,
        notifications
      }
    });
  } catch (error) {
    next(error);
  }
};
