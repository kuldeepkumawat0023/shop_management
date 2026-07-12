const express = require('express');
const router = express.Router();
const { logProduction, getProductions, getProductionById, deleteProduction } = require('../controllers/productionController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), logProduction);
router.get('/all', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getProductions);
router.get('/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getProductionById);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), deleteProduction);

module.exports = router;
