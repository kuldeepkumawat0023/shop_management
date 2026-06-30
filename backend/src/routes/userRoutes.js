const express = require('express');
const router = express.Router();

const { 
  getUsers, 
  getProfile, 
  updateProfile, 
  deleteProfile,
  createStaff
} = require('../controllers/userController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload'); // For profile photo

// =====================
// Profile Routes (For logged in user)
// =====================

// Get own profile or any profile (if super_admin/shop_owner)
router.get('/profile/:id', protect, getProfile);

// Update profile (Requires file upload middleware for profilePhoto)
router.put('/profile/update/:id', protect, upload.single('profilePhoto'), updateProfile);

// =====================
// Staff Management Routes (Requires shopScope & Role Check)
// =====================

// Get all staff users in the shop (Super Admin gets all users)
router.get('/all', protect, shopScope, getUsers);

// Create a new staff member (Only for Super Admin and Shop Owner)
router.post('/staff', protect, authorizeRoles('super_admin', 'shop_owner'), createStaff);

// Deactivate a user account
router.delete('/profile/delete/:id', protect, authorizeRoles('super_admin', 'shop_owner'), deleteProfile);

module.exports = router;
