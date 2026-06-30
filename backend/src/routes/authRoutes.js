const express = require('express');
const router = express.Router();

const { 
  login, 
  googleLogin, 
  forgotPassword, 
  verifyOtp, 
  resetPassword, 
  reactivateAccount,
  logout 
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/reactivate-account', reactivateAccount);
router.post('/logout', protect, logout);

module.exports = router;
