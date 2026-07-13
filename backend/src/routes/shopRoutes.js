const express = require('express');
const router = express.Router();

const { 
  initCreateShop,
  createShop, 
  getShops, 
  getMyShop,
  getMyShops, 
  updateShop,
  switchShop, 
  deleteShop,
  checkShopName,
  checkShopLimit
} = require('../controllers/shopController');

const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

// Apply protection to all routes
router.use(protect);

// My Shop route for staff/managers/owners (Must come before /:id)
router.get('/my-shop', shopScope, getMyShop);
router.get('/my-shops', getMyShops);

// Switch Active Shop Context
router.put('/switch/:id', switchShop);

// Ponytail: New APIs for Workspace Limit & Shop Verification
router.post('/check-name', checkShopName);
router.get('/check-limit', checkShopLimit);

// Basic Shop Operations
router.post('/init-create', requirePermission(PERMISSIONS.SHOPS_CREATE), initCreateShop);
router.post('/create', requirePermission(PERMISSIONS.SHOPS_CREATE), createShop);
router.get('/all', requirePermission(PERMISSIONS.SHOPS_VIEW), getShops);
router.delete('/delete/:id', requirePermission(PERMISSIONS.SHOPS_DELETE), deleteShop);

// Update route
router.put('/update/:id', requirePermission(PERMISSIONS.SHOPS_UPDATE), upload.single('logo'), updateShop);

module.exports = router;
