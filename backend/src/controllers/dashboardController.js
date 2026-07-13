const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get dashboard metrics (Today's Sales, Profit, Expenses, Low Stock)
// @route   GET /api/v1/dashboard/stats
// @access  Private (Managers/Owners)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const shopId = req.scopedShopId;
    
    // 100% SAFE: Ensure shopId is properly cast to ObjectId for aggregations
    // Aggregation pipelines do not automatically cast strings like Mongoose .find() does.
    const matchStage = {};
    if (shopId) {
      matchStage.shopId = new mongoose.Types.ObjectId(shopId);
    }
    
    // Calculate date boundaries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    
    const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // ==========================================
    // 1. SALES METRICS FACET
    // ==========================================
    const salesAgg = await Sale.aggregate([
      { $match: matchStage }, // Master Match
      {
        $facet: {
          todaysStats: [
            { $match: { saleDate: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { 
                _id: null, 
                revenue: { $sum: { $ifNull: ['$netAmount', 0] } }, 
                profit: { $sum: { $ifNull: ['$totalProfit', 0] } } 
              } 
            }
          ],
          thisMonthStats: [
            { $match: { saleDate: { $gte: startOfMonth, $lte: endOfToday } } },
            { $group: { 
                _id: null, 
                revenue: { $sum: { $ifNull: ['$netAmount', 0] } }, 
                profit: { $sum: { $ifNull: ['$totalProfit', 0] } } 
              } 
            }
          ],
          unpaidInvoices: [
            { $match: { paymentStatus: { $ne: 'Paid' } } },
            { $group: { 
                _id: null, 
                // 100% SAFE: Prevent crashes if netAmount or paidAmount are missing in old DB records
                outstanding: { $sum: { $subtract: [{ $ifNull: ['$netAmount', 0] }, { $ifNull: ['$paidAmount', 0] }] } },
                count: { $sum: 1 }
              } 
            }
          ]
        }
      }
    ]);

    // ==========================================
    // 2. EXPENSE METRICS FACET
    // ==========================================
    const expensesAgg = await Expense.aggregate([
      { $match: { ...matchStage, isActive: true } },
      {
        $facet: {
          todaysStats: [
            { $match: { expenseDate: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, totalExpense: { $sum: { $ifNull: ['$amount', 0] } } } }
          ],
          thisMonthStats: [
            { $match: { expenseDate: { $gte: startOfMonth, $lte: endOfToday } } },
            { $group: { _id: null, totalExpense: { $sum: { $ifNull: ['$amount', 0] } } } }
          ]
        }
      }
    ]);

    // ==========================================
    // 3. INVENTORY METRICS FACET
    // ==========================================
    const inventoryAgg = await Product.aggregate([
      { $match: { ...matchStage, isActive: true } },
      {
        $facet: {
          lowStockAlerts: [
            // 100% SAFE: Ensure currentStock and minStock have fallbacks
            { $match: { $expr: { $and: [ 
                { $lte: [{ $ifNull: ['$currentStock', 0] }, { $ifNull: ['$minStock', 5] }] }, 
                { $gt: [{ $ifNull: ['$currentStock', 0] }, 0] } 
              ] } } 
            },
            { $project: { name: 1, currentStock: 1, minStock: 1 } },
            { $sort: { currentStock: 1 } },
            { $limit: 10 } 
          ],
          outOfStock: [
            { $match: { currentStock: { $lte: 0 } } },
            { $count: "totalOut" }
          ],
          valuation: [
            { $group: { 
                _id: null, 
                // 100% SAFE: Multiplication will fail if fields are missing, so we use ifNull
                totalValue: { $sum: { $multiply: [{ $ifNull: ['$currentStock', 0] }, { $ifNull: ['$purchasePrice', 0] }] } } 
              } 
            }
          ]
        }
      }
    ]);

    // ==========================================
    // 4. PARSE RESULTS
    // ==========================================
    const s = salesAgg[0] || {};
    const e = expensesAgg[0] || {};
    const i = inventoryAgg[0] || {};

    // Safely extract from arrays
    const todaysSales = s.todaysStats?.length > 0 ? s.todaysStats[0].revenue : 0;
    const todaysProfit = s.todaysStats?.length > 0 ? s.todaysStats[0].profit : 0;
    
    const thisMonthSales = s.thisMonthStats?.length > 0 ? s.thisMonthStats[0].revenue : 0;
    const thisMonthProfit = s.thisMonthStats?.length > 0 ? s.thisMonthStats[0].profit : 0;
    
    const totalPendingPayments = s.unpaidInvoices?.length > 0 ? s.unpaidInvoices[0].outstanding : 0;
    
    const todaysExpenses = e.todaysStats?.length > 0 ? e.todaysStats[0].totalExpense : 0;
    const thisMonthExpenses = e.thisMonthStats?.length > 0 ? e.thisMonthStats[0].totalExpense : 0;

    const lowStockAlerts = i.lowStockAlerts || [];
    const outOfStockCount = i.outOfStock?.length > 0 ? i.outOfStock[0].totalOut : 0;
    const inventoryValuation = i.valuation?.length > 0 ? i.valuation[0].totalValue : 0;

    res.status(200).json({
      success: true,
      data: {
        // Daily
        todaysSales,
        todaysProfit,
        todaysExpenses,
        netProfit: todaysProfit - todaysExpenses,
        
        // Monthly
        thisMonthSales,
        thisMonthProfit,
        thisMonthExpenses,
        thisMonthNetProfit: thisMonthProfit - thisMonthExpenses,
        
        // General Stats
        totalPendingPayments,
        inventoryValuation,
        outOfStockCount,
        lowStockAlerts
      }
    });
  } catch (error) {
    next(error);
  }
};
