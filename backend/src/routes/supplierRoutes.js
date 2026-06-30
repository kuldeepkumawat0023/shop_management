const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), createSupplier);
router.get('/all', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getSuppliers);
router.put('/update/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), updateSupplier);
router.delete('/delete/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), deleteSupplier);

module.exports = router;
