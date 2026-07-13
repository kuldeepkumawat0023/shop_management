const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.SUPPLIERS_CREATE), createSupplier);
router.get('/all', requirePermission(PERMISSIONS.SUPPLIERS_VIEW), getSuppliers);
router.put('/update/:id', requirePermission(PERMISSIONS.SUPPLIERS_UPDATE), updateSupplier);
router.delete('/delete/:id', requirePermission(PERMISSIONS.SUPPLIERS_DELETE), deleteSupplier);

module.exports = router;
