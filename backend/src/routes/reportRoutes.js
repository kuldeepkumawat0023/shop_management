const express = require('express');
const router = express.Router();
const { exportGSTR1 } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.get('/gstr1', requirePermission(PERMISSIONS.VIEW_REPORTS), exportGSTR1);

module.exports = router;
