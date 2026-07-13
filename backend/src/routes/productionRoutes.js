const express = require('express');
const router = express.Router();
const { logProduction, getProductions, getProductionById, deleteProduction } = require('../controllers/productionController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.PRODUCTIONS_CREATE), logProduction);
router.get('/all', requirePermission(PERMISSIONS.PRODUCTIONS_VIEW), getProductions);
router.get('/:id', requirePermission(PERMISSIONS.PRODUCTIONS_VIEW), getProductionById);
router.delete('/:id', requirePermission(PERMISSIONS.PRODUCTIONS_DELETE), deleteProduction);

module.exports = router;
