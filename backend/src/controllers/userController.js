const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all users (Staff & Managers scoped to Shop)
// @route   GET /api/v1/user/all
// @access  Private (Managers / Shop Owners / Super Admin)
exports.getUsers = async (req, res, next) => {
  try {
    let query = { isActive: true };

    // If user is not super_admin, only show staff from their own shop
    if (req.user.role !== 'super_admin') {
      query.shopId = req.user.shopId;
    }

    const users = await User.find(query).select('fullname email role phoneNumber profilePhoto isActive shopId createdAt');
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile by ID
// @route   GET /api/v1/user/profile/:id
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    // Security: Only super_admin, shop_owner, or the user themselves can view full profile details
    if (req.user.id !== req.params.id && req.user.role !== 'super_admin' && req.user.role !== 'shop_owner') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized access to this profile', data: null });
    }

    const user = await User.findById(req.params.id)
      .populate('shopId', 'name address contactNumber')
      .populate('customRoleId')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile fetched successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile by ID
// @route   PUT /api/v1/user/profile/update/:id
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Security check: User can only update their own profile (Super Admin can update anyone)
    if (req.user.id !== req.params.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized update request', data: null });
    }

    const { fullname, phoneNumber, countryCode, personalDetail, twoFactorEnabled, notificationPreferences, role, shopId } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    // Handle Cloudinary Profile Photo Upload
    if (req.file && req.file.fieldname === 'profilePhoto') {
      if (user.profilePhoto) {
        await deleteFromCloudinary(user.profilePhoto);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'shop_management/profiles', 'image');
      user.profilePhoto = result.secure_url;
    }

    // Update Basic Fields
    if (fullname !== undefined) user.fullname = fullname;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (countryCode !== undefined) user.countryCode = countryCode;

    if (twoFactorEnabled !== undefined) {
      user.twoFactorEnabled = twoFactorEnabled === 'true' || twoFactorEnabled === true;
    }

    if (notificationPreferences) {
      user.notificationPreferences = typeof notificationPreferences === 'string'
        ? JSON.parse(notificationPreferences)
        : notificationPreferences;
    }

    if (personalDetail) {
      user.personalDetail = typeof personalDetail === 'string' ? JSON.parse(personalDetail) : personalDetail;
    }

    // Only super_admin or shop_owner can change roles or shop assignment
    if ((role || shopId) && (req.user.role === 'super_admin' || req.user.role === 'shop_owner')) {
      if (role) user.role = role;
      if (shopId) user.shopId = shopId;
    }

    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete (Deactivate) user profile by ID
// @route   DELETE /api/v1/user/profile/delete/:id
// @access  Private (Shop Owner / Super Admin)
exports.deleteProfile = async (req, res, next) => {
  try {
    // Only super_admin or shop_owner can deactivate an account
    if (req.user.role !== 'super_admin' && req.user.role !== 'shop_owner') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized delete request. Only admins can deactivate users.', data: null });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    // Prevent shop_owner from deleting users from a different shop
    if (req.user.role === 'shop_owner' && user.shopId.toString() !== req.user.shopId.toString()) {
        return res.status(403).json({ success: false, statusCode: 403, message: 'You can only deactivate staff within your own shop.', data: null });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User account successfully deactivated',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new staff member (Shop Owner / Super Admin)
// @route   POST /api/v1/user/staff
// @access  Private
exports.createStaff = async (req, res, next) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'shop_owner') {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized. Only Shop Owners can add staff.' });
    }

    const { fullname, email, role, phoneNumber, shopId, customRoleId } = req.body;

    if (!fullname || !email || !role) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide fullname, email, and role.' });
    }

    const userExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'User with this email already exists.' });
    }

    // Determine the shop ID to assign
    const targetShopId = req.user.role === 'super_admin' ? shopId : req.user.shopId;
    
    if (!targetShopId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Shop ID is required to create a staff member.' });
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1@';

    const newUser = await User.create({
      fullname,
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber || '0000000000',
      password: tempPassword,
      role,
      shopId: targetShopId,
      customRoleId: customRoleId || null,
      isActive: true,
      isPending: true // Mark as pending until first login
    });

    // Send Invite Email
    const sendEmail = require('../config/email');
    const { getStaffInviteEmail } = require('../utils/emailTemplates');
    
    sendEmail({ 
      email: newUser.email, 
      subject: 'You are invited to Thori Technical Shop', 
      html: getStaffInviteEmail(newUser.fullname, newUser.email, tempPassword, newUser.role) 
    }).catch(e => console.log('Failed to send invite email:', e));

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Staff member created successfully and invite email sent.',
      data: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    next(error);
  }
};
