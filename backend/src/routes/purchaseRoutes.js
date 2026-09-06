const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases, getPurchaseById, deletePurchase, downloadPurchasePDF } = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.PURCHASES_CREATE), createPurchase);
router.get('/all', requirePermission(PERMISSIONS.PURCHASES_VIEW), getPurchases);
router.get('/get/:id', requirePermission(PERMISSIONS.PURCHASES_VIEW), getPurchaseById);
router.get('/:id/pdf', requirePermission(PERMISSIONS.PURCHASES_VIEW), downloadPurchasePDF);
router.delete('/delete/:id', requirePermission(PERMISSIONS.PURCHASES_DELETE), deletePurchase);

module.exports = router;
