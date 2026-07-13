const express = require('express');
const router = express.Router();

const { 
  getUsers, 
  getProfile, 
  updateProfile, 
  deleteProfile,
  createStaff
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload'); // For profile photo
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

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

// Get all staff users in the shop
router.get('/all', protect, shopScope, requirePermission(PERMISSIONS.USERS_VIEW), getUsers);

// Create a new staff member
router.post('/staff', protect, requirePermission(PERMISSIONS.USERS_CREATE), createStaff);

// Deactivate a user account
router.delete('/profile/delete/:id', protect, requirePermission(PERMISSIONS.USERS_DELETE), deleteProfile);

module.exports = router;
