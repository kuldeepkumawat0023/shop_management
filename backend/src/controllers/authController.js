const User = require('../models/User');
const Shop = require('../models/Shop');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const sendEmail = require('../config/email');
const {
  getWelcomeEmail,
  getReactivationEmail,
  getLoginNotificationEmail,
  getPasswordResetEmail
} = require('../utils/emailTemplates');
const { ADMIN_DEFAULT_ROLES, PERMISSION_LIST } = require('../config/permissions');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

// Helper to verify reCAPTCHA
const verifyRecaptcha = async (captchaToken) => {
  if (!captchaToken) return false;
  // Bypassed if secret key not found in env
  if (!process.env.RECAPTCHA_SECRET_KEY) return true;

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`);
    return response.data.success;
  } catch (err) {
    return false;
  }
};

// Helper function to sign JWT
const TOKEN_TTL_DAYS = parseInt(process.env.JWT_EXPIRES_IN) || 30;
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};
const getExpiresAt = () => Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

// Helper to get Permissions based on Role
const getPermissionsForUser = async (user) => {
  let permissions = [];

  if (user.role === 'super_admin') {
    permissions = ['all'];
  } else if (user.role === 'shop_owner') {
    permissions = PERMISSION_LIST; // Can refine if shop owners have slightly less
  } else if (user.customRoleId) {
    const CustomRole = require('../models/CustomRole');
    const role = await CustomRole.findById(user.customRoleId);
    if (role && role.isActive) {
      permissions = role.permissions || [];
    }
  } else if (user.role === 'manager') {
    permissions = ADMIN_DEFAULT_ROLES.MANAGER.permissions;
  } else if (user.role === 'staff') {
    permissions = ADMIN_DEFAULT_ROLES.STAFF.permissions;
  }

  return permissions;
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullname, email, countryCode, phoneNumber, password, confirmPassword, captchaToken } = req.body;

    // Validate input
    if (!fullname || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide all required fields', data: null });
    }

    if (process.env.RECAPTCHA_SECRET_KEY && !captchaToken) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'reCAPTCHA token missing', data: null });
    }
    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'reCAPTCHA verification failed', data: null });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Passwords do not match', data: null });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      if (userExists.isActive) {
        return res.status(409).json({ success: false, statusCode: 409, message: 'User already exists', data: null });
      } else {
        // --- REACTIVATION FLOW ---
        // Generate 6 digit OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        // Set OTP and expiry (10 mins)
        userExists.otp = otp;
        userExists.otpExpiry = Date.now() + 10 * 60 * 1000;
        userExists.isOtpVerified = false;
        await userExists.save({ validateBeforeSave: false });

        try {
          await sendEmail({
            email: userExists.email,
            subject: 'Account Reactivation OTP - Shop Management',
            html: getReactivationEmail(userExists.fullname, otp)
          });

          return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Account is deactivated. Reactivation OTP sent to email.',
            data: { isReactivation: true }
          });
        } catch (err) {
          userExists.otp = undefined;
          userExists.otpExpiry = undefined;
          await userExists.save({ validateBeforeSave: false });
          // If email fails, don't crash the server, just let the user know
          return res.status(400).json({ success: false, statusCode: 400, message: 'Email could not be sent. Please check your mail settings.', data: null });
        }
      }
    }

    // Create new user as shop_owner
    const user = await User.create({
      fullname,
      email: normalizedEmail,
      countryCode: countryCode || '+91',
      phoneNumber,
      password,
      role: 'shop_owner'
    });

    // ponytail: Removed shop creation from register. Shop will be created via a separate API/Popup in the dashboard.

    // Create token
    const token = signToken(user._id);

    // Send Welcome Email (Fire and forget, handle error gracefully)
    sendEmail({
      email: user.email,
      subject: 'Welcome to Thori Technical Shop',
      html: getWelcomeEmail(user.fullname)
    }).catch(err => console.log('Failed to send welcome email:', err.message));

    // Send response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          shopId: user.shopId
        },
        token,
        expiresAt: getExpiresAt()
      }
    });

  } catch (error) {
    next(error); // Passes to global error handler
  }
};


// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, captchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide email and password', data: null });
    }

    if (process.env.RECAPTCHA_SECRET_KEY && !captchaToken) {
        return res.status(400).json({ success: false, statusCode: 400, message: 'reCAPTCHA token missing', data: null });
    }

    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'reCAPTCHA verification failed', data: null });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid credentials', data: null });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Account deactivated. Contact support.', data: null });
    }

    // Clear isPending if this is a first time login from invite
    if (user.isPending) {
      user.isPending = false;
      await user.save({ validateBeforeSave: false });
    }

    const token = signToken(user._id);

    // Send Login Notification Async
    sendEmail({ email: user.email, subject: 'Secure Login Alert', html: getLoginNotificationEmail(user.fullname) }).catch(e => console.log(e));

    const permissions = await getPermissionsForUser(user);

    res.status(200).json({
      success: true, statusCode: 200, message: 'Login successful',
      data: {
        user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role, shopId: user.shopId, permissions },
        token, expiresAt: getExpiresAt()
      }
    });
  } catch (error) { next(error); }
};

// @desc    Google OAuth Login
// @route   POST /api/v1/auth/google-login
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken, accessToken } = req.body;
    let email, fullname, profilePhoto;

    if (idToken) {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      email = payload.email; fullname = payload.name; profilePhoto = payload.picture;
    } else if (accessToken) {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } });
      email = response.data.email; fullname = response.data.name; profilePhoto = response.data.picture;
    } else {
      return res.status(400).json({ success: false, message: 'Google token required' });
    }

    let user = await User.findOne({ email });

    if (user && user.isActive === false) {
      user.isActive = true; await user.save();
    }
    if (user && user.isPending === true) {
      user.isPending = false; await user.save();
    }
    if (user && !user.profilePhoto && profilePhoto) {
      user.profilePhoto = profilePhoto; await user.save();
    }

    if (!user) {
      user = await User.create({
        fullname, email, phoneNumber: '0000000000', countryCode: '+91',
        password: Math.random().toString(36).slice(-8) + 'Aa1@',
        profilePhoto, role: 'staff', isActive: true // Default to staff
      });
    }

    const token = signToken(user._id);
    const permissions = await getPermissionsForUser(user);

    res.status(200).json({
      success: true, statusCode: 200, message: 'Google login successful',
      data: {
        user: { _id: user._id, fullname: user.fullname, email: user.email, profilePhoto: user.profilePhoto, role: user.role, shopId: user.shopId, permissions },
        token, expiresAt: getExpiresAt()
      }
    });
  } catch (error) { return res.status(401).json({ success: false, message: 'Invalid Google token' }); }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide an email' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    user.otp = otp; user.otpExpiry = Date.now() + 10 * 60 * 1000; user.isOtpVerified = false;
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({ email: user.email, subject: 'Password Reset OTP', html: getPasswordResetEmail(otp) });
      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      user.otp = undefined; user.otpExpiry = undefined; await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) { next(error); }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Please provide email and OTP' });

    const user = await User.findOne({ email: email.trim().toLowerCase(), otp, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });

    user.isOtpVerified = true; user.otp = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'OTP verified. You can now reset password.' });
  } catch (error) { next(error); }
};

// @desc    Reset Password via OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) return res.status(400).json({ success: false, message: 'Please provide all fields' });
    if (newPassword !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords do not match' });

    const user = await User.findOne({ email: email.trim().toLowerCase(), isOtpVerified: true, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(401).json({ success: false, message: 'OTP verification incomplete or expired' });

    user.password = newPassword; user.isOtpVerified = false; user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) { next(error); }
};

// @desc    Reactivate Account via OTP
// @route   POST /api/v1/auth/reactivate-account
// @access  Public
exports.reactivateAccount = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords mismatch' });

    const user = await User.findOne({ email: email.trim().toLowerCase(), isOtpVerified: true, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(401).json({ success: false, message: 'OTP verification incomplete/expired' });

    user.isActive = true; user.password = newPassword; user.isOtpVerified = false; user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Account reactivated successfully' });
  } catch (error) { next(error); }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
