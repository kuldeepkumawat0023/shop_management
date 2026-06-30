const express = require('express');
const router = express.Router();
const { logProduction } = require('../controllers/productionController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), logProduction);

module.exports = router;
