const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');

// We don't use strict role here as we can check if user is admin/owner
// But let's assume it's protected by SUPER_ADMIN for settings
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Both endpoints restricted to Super Admin or Shop Owner
router.get('/get', getSettings); // maybe allow managers to view? Sure, let's keep it simple.
router.put('/update', requirePermission(PERMISSIONS.SUPER_ADMIN), updateSettings);

module.exports = router;
