const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Product = require('../models/Product');

// @desc    Get dashboard metrics (Today's Sales, Profit, Expenses, Low Stock)
// @route   GET /api/v1/dashboard/stats
// @access  Private (Managers/Owners)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const shopId = req.scopedShopId;
    
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
      { $match: { shopId } }, // Master Match: Filter by shop immediately
      {
        $facet: {
          todaysStats: [
            { $match: { saleDate: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, revenue: { $sum: '$netAmount' }, profit: { $sum: '$totalProfit' } } }
          ],
          thisMonthStats: [
            { $match: { saleDate: { $gte: startOfMonth, $lte: endOfToday } } },
            { $group: { _id: null, revenue: { $sum: '$netAmount' }, profit: { $sum: '$totalProfit' } } }
          ],
          unpaidInvoices: [
            { $match: { paymentStatus: { $ne: 'Paid' } } },
            { $group: { 
                _id: null, 
                outstanding: { $sum: { $subtract: ['$netAmount', '$paidAmount'] } },
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
      { $match: { shopId, isActive: true } },
      {
        $facet: {
          todaysStats: [
            { $match: { expenseDate: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
          ],
          thisMonthStats: [
            { $match: { expenseDate: { $gte: startOfMonth, $lte: endOfToday } } },
            { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
          ]
        }
      }
    ]);

    // ==========================================
    // 3. INVENTORY METRICS FACET
    // ==========================================
    const inventoryAgg = await Product.aggregate([
      { $match: { shopId, isActive: true } },
      {
        $facet: {
          lowStockAlerts: [
            // Only find items that are low on stock but NOT totally out of stock
            { $match: { $expr: { $and: [ { $lte: ['$currentStock', '$minStock'] }, { $gt: ['$currentStock', 0] } ] } } },
            { $project: { name: 1, currentStock: 1, minStock: 1 } },
            { $sort: { currentStock: 1 } },
            { $limit: 10 } // Limit to prevent large payload
          ],
          outOfStock: [
            { $match: { currentStock: { $lte: 0 } } },
            { $count: "totalOut" }
          ],
          valuation: [
            { $group: { 
                _id: null, 
                totalValue: { $sum: { $multiply: ['$currentStock', '$purchasePrice'] } } 
              } 
            }
          ]
        }
      }
    ]);

    // ==========================================
    // 4. PARSE RESULTS
    // ==========================================
    const s = salesAgg[0];
    const e = expensesAgg[0];
    const i = inventoryAgg[0];

    const todaysSales = s.todaysStats[0]?.revenue || 0;
    const todaysProfit = s.todaysStats[0]?.profit || 0;
    const thisMonthSales = s.thisMonthStats[0]?.revenue || 0;
    const thisMonthProfit = s.thisMonthStats[0]?.profit || 0;
    const totalPendingPayments = s.unpaidInvoices[0]?.outstanding || 0;
    
    const todaysExpenses = e.todaysStats[0]?.totalExpense || 0;
    const thisMonthExpenses = e.thisMonthStats[0]?.totalExpense || 0;

    const lowStockAlerts = i.lowStockAlerts || [];
    const outOfStockCount = i.outOfStock[0]?.totalOut || 0;
    const inventoryValuation = i.valuation[0]?.totalValue || 0;

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
