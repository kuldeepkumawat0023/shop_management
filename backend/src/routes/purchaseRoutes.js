const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases, getPurchaseById } = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.PURCHASES_CREATE), createPurchase);
router.get('/all', requirePermission(PERMISSIONS.PURCHASES_VIEW), getPurchases);
router.get('/get/:id', requirePermission(PERMISSIONS.PURCHASES_VIEW), getPurchaseById);

module.exports = router;
