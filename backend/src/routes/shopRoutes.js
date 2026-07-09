const express = require('express');
const router = express.Router();

const { 
  createShop, 
  getShops, 
  getMyShop, 
  updateShop,
  switchShop, 
  deleteShop,
  checkShopName,
  checkShopLimit
} = require('../controllers/shopController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload');

// Apply protection to all routes
router.use(protect);

// My Shop route for staff/managers/owners (Must come before /:id)
router.get('/my-shop', shopScope, getMyShop);

// Switch Active Shop Context
router.put('/switch/:id', switchShop);

// Ponytail: New APIs for Workspace Limit & Shop Verification
router.post('/check-name', checkShopName);
router.get('/check-limit', checkShopLimit);

// Create route (Allow super_admin and shop_owner)
router.post('/create', authorizeRoles('super_admin', 'shop_owner'), createShop);
router.get('/all', authorizeRoles('super_admin'), getShops);
router.delete('/delete/:id', authorizeRoles('super_admin'), deleteShop);

// Update route (Owner can update their own shop, Super Admin can update any)
router.put('/update/:id', authorizeRoles('super_admin', 'shop_owner'), upload.single('logo'), updateShop);

module.exports = router;
