const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases, getPurchaseById } = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_PURCHASES), createPurchase);
router.get('/all', requirePermission(PERMISSIONS.MANAGE_PURCHASES), getPurchases);
router.get('/get/:id', requirePermission(PERMISSIONS.MANAGE_PURCHASES), getPurchaseById);

module.exports = router;
