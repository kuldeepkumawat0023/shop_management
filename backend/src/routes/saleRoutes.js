const express = require('express');
const router = express.Router();
const { createSale, getSales, getSaleById, updateSale, deleteSale, downloadSalePDF } = require('../controllers/saleController');
const { processOfflineSync } = require('../services/syncService');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.SALES_CREATE), createSale);
router.get('/all', requirePermission(PERMISSIONS.SALES_VIEW), getSales);
router.get('/get/:id', requirePermission(PERMISSIONS.SALES_VIEW), getSaleById);
router.get('/:id/pdf', requirePermission(PERMISSIONS.SALES_VIEW), downloadSalePDF);
router.put('/update/:id', requirePermission(PERMISSIONS.SALES_UPDATE), updateSale);
router.delete('/delete/:id', requirePermission(PERMISSIONS.SALES_DELETE), deleteSale);
// Offline Bulk Sync Route
router.post('/sync', requirePermission(PERMISSIONS.SALES_CREATE), async (req, res, next) => {
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
