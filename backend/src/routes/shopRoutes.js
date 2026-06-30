const express = require('express');
const router = express.Router();

const { 
  createShop, 
  getShops, 
  getMyShop, 
  updateShop,
  switchShop, 
  deleteShop 
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

// Global routes restricted to Super Admin
router.post('/create', authorizeRoles('super_admin'), createShop);
router.get('/all', authorizeRoles('super_admin'), getShops);
router.delete('/delete/:id', authorizeRoles('super_admin'), deleteShop);

// Update route (Owner can update their own shop, Super Admin can update any)
router.put('/update/:id', authorizeRoles('super_admin', 'shop_owner'), upload.single('logo'), updateShop);

module.exports = router;
