const express = require('express');
const router = express.Router();
const { logDamage, getDamages } = require('../controllers/damageController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), logDamage);
router.get('/all', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getDamages);

module.exports = router;
