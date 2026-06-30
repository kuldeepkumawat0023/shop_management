const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Product = require('../models/Product');

// @desc    Get dashboard metrics (Today's Sales, Profit, Expenses, Low Stock)
// @route   GET /api/v1/dashboard/stats
// @access  Private (Managers/Owners)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const shopId = req.scopedShopId;
    
    // Calculate start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Today's Sales & Profit Aggregation
    const salesAgg = await Sale.aggregate([
      { 
        $match: { 
          shopId, 
          saleDate: { $gte: startOfToday, $lte: endOfToday } 
        } 
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$netAmount' },
          totalProfit: { $sum: '$totalProfit' }
        }
      }
    ]);

    const todaysSales = salesAgg.length > 0 ? salesAgg[0].totalSales : 0;
    const todaysProfit = salesAgg.length > 0 ? salesAgg[0].totalProfit : 0;

    // 2. Today's Expenses
    const expensesAgg = await Expense.aggregate([
      { 
        $match: { 
          shopId, 
          isActive: true,
          expenseDate: { $gte: startOfToday, $lte: endOfToday } 
        } 
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' }
        }
      }
    ]);
    const todaysExpenses = expensesAgg.length > 0 ? expensesAgg[0].totalExpense : 0;

    // 3. Low Stock Items (Threshold: 5)
    // Could also make threshold dynamic based on product settings
    const lowStockProducts = await Product.find({ 
      shopId, 
      isActive: true, 
      currentStock: { $lte: 10 } 
    }).select('name currentStock').limit(10).sort('currentStock');

    res.status(200).json({
      success: true,
      data: {
        todaysSales,
        todaysProfit,
        todaysExpenses,
        netProfit: todaysProfit - todaysExpenses, // Today's actual bottom line
        lowStockAlerts: lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};
