const express = require('express');
const router = express.Router();

const { 
  register,
  login, 
  googleLogin, 
  forgotPassword, 
  verifyOtp, 
  resetPassword, 
  reactivateAccount,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  verifyOtpLimiter,
  resetPasswordLimiter,
  generalAuthLimiter
} = require('../middlewares/rateLimiter');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/google-login', generalAuthLimiter, googleLogin);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/verify-otp', verifyOtpLimiter, verifyOtp);
router.post('/reset-password', resetPasswordLimiter, resetPassword);
router.post('/reactivate-account', generalAuthLimiter, reactivateAccount);
router.post('/logout', protect, generalAuthLimiter, logout);

module.exports = router;
