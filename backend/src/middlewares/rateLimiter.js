const rateLimit = require('express-rate-limit');

// ponytail: Minimum viable rate limiters. Bypassed in dev for easier testing.
const createLimiter = (max, messageStr) => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max, // Limit each IP to 'max' requests per window
  skipSuccessfulRequests: true, // Only count failed attempts (like wrong password)
  message: {
    success: false,
    statusCode: 429,
    message: messageStr,
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' // ponytail: skip limits in dev
});

// Separate limiters for each action so they don't block each other globally
exports.loginLimiter = createLimiter(3, 'Too many login attempts, please try again after 15 minutes');
exports.registerLimiter = createLimiter(3, 'Too many registration attempts, please try again after 15 minutes');
exports.forgotPasswordLimiter = createLimiter(3, 'Too many forgot password attempts, please try again after 15 minutes');
exports.verifyOtpLimiter = createLimiter(3, 'Too many OTP verification attempts, please try again after 15 minutes');
exports.resetPasswordLimiter = createLimiter(3, 'Too many password reset attempts, please try again after 15 minutes');
exports.generalAuthLimiter = createLimiter(10, 'Too many authentication attempts, please try again after 15 minutes');
