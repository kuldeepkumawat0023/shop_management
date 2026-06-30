const Sale = require('../models/Sale');
const { generateGSTR1 } = require('../services/excelService');

// @desc    Download GSTR-1 Sales Report in Excel
// @route   GET /api/v1/reports/gstr1
// @access  Private (Managers/Owners)
exports.exportGSTR1 = async (req, res, next) => {
  try {
    const shopId = req.scopedShopId;
    const { startDate, endDate } = req.query;

    const query = { shopId };
    
    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(query).populate('customerId', 'name gstNumber');

    if (!sales || sales.length === 0) {
      return res.status(404).json({ success: false, message: 'No sales found for this period' });
    }

    // Call our excel service which will pipe directly to 'res'
    await generateGSTR1(sales, res);
  } catch (error) {
    next(error);
  }
};
