const express = require('express');
const router = express.Router();
const { createSale, getSales, getSaleById } = require('../controllers/saleController');
const { processOfflineSync } = require('../services/syncService');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.POS_ACCESS), createSale);
router.get('/all', requirePermission(PERMISSIONS.VIEW_SALES), getSales);
router.get('/get/:id', requirePermission(PERMISSIONS.VIEW_SALES), getSaleById);

// Offline Bulk Sync Route
router.post('/sync', requirePermission(PERMISSIONS.POS_ACCESS), async (req, res, next) => {
  try {
    const { bills } = req.body;
    if (!Array.isArray(bills) || bills.length === 0) {
      return res.status(400).json({ success: false, message: 'Bills array is required for sync' });
    }
    const result = await processOfflineSync(bills, req.scopedShopId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
});

module.exports = router;
