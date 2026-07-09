const Shop = require('../models/Shop');
const User = require('../models/User');
const AdminRole = require('../models/AdminRole');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ADMIN_DEFAULT_ROLES } = require('../config/permissions');

// @desc    Check if a shop name already exists
// @route   POST /api/v1/shops/check-name
// @access  Private
exports.checkShopName = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Shop name is required', data: null });
    }

    // Use a case-insensitive regex for exact match
    const shop = await Shop.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      exists: !!shop,
      message: !!shop ? 'Shop name already exists' : 'Shop name is available',
      data: { exists: !!shop }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user can create a new shop (Workspace Limit)
// @route   GET /api/v1/shops/check-limit
// @access  Private
exports.checkShopLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'User not found', data: null });
    }

    // ponytail: Hardcoded limit of 3 shops for simplicity (YAGNI)
    const maxShopsAllowed = 3;
    const currentShops = user.assignedShops ? user.assignedShops.length : 0;
    const canCreate = currentShops < maxShopsAllowed;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        canCreate,
        currentShops,
        maxShopsAllowed
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Shop (Super Admin)
// @route   POST /api/v1/shops
// @access  Private (Super Admin)
exports.createShop = async (req, res, next) => {
  try {
    const { name, ownerId, gstNumber, contactNumber, email, address } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Shop name and Owner ID are required', data: null });
    }

    // Verify owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Owner user not found', data: null });
    }

    // Check if shop name already exists
    const existingShop = await Shop.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingShop) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Shop name already exists', data: null });
    }

    // ponytail: Check shop limit before creating (YAGNI hardcoded limit of 3)
    const maxShopsAllowed = 3;
    if (owner.assignedShops && owner.assignedShops.length >= maxShopsAllowed) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Workspace limit reached. You can only create up to ${maxShopsAllowed} shops.`,
        data: null
      });
    }

    const shop = await Shop.create({
      name, ownerId, gstNumber, contactNumber, email, address
    });

    // Assign shop to owner and switch context
    if (!owner.assignedShops.includes(shop._id)) {
      owner.assignedShops.push(shop._id);
    }
    owner.shopId = shop._id;
    if (owner.role === 'staff' || owner.role === 'manager') {
      owner.role = 'shop_owner';
    }
    await owner.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Shop created successfully with default roles',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Switch active shop context
// @route   PUT /api/v1/shops/switch/:id
// @access  Private
exports.switchShop = async (req, res, next) => {
  try {
    const targetShopId = req.params.id;
    const shop = await Shop.findOne({ _id: targetShopId, isActive: true });
    
    if (!shop) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Shop not found or inactive', data: null });
    }

    const user = await User.findById(req.user.id);

    // Security Check: Super admin can switch anywhere. Others must have it in assignedShops.
    if (user.role !== 'super_admin' && !user.assignedShops.includes(targetShopId)) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to switch to this shop', data: null });
    }

    user.shopId = targetShopId;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Switched active shop successfully',
      data: {
        shopId: shop._id,
        shopName: shop.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Shops
// @route   GET /api/v1/shops
// @access  Private (Super Admin)
exports.getShops = async (req, res, next) => {
  try {
    const shops = await Shop.find({ isActive: true }).populate('ownerId', 'fullname email phoneNumber');
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Shops fetched successfully',
      data: shops
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my Shop details
// @route   GET /api/v1/shops/my-shop
// @access  Private (Shop Owner / Manager / Staff)
exports.getMyShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.scopedShopId).populate('ownerId', 'fullname email phoneNumber');
    
    if (!shop) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Shop not found', data: null });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Shop fetched successfully',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Shop details
// @route   PUT /api/v1/shops/:id
// @access  Private (Super Admin or the specific Shop Owner)
exports.updateShop = async (req, res, next) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Shop not found', data: null });
    }

    // Security check: Only Super Admin or the actual Shop Owner can update
    if (req.user.role !== 'super_admin' && req.user.id.toString() !== shop.ownerId.toString()) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'You can only update your own shop', data: null });
    }

    const updateData = { ...req.body };

    // Handle Logo Upload
    if (req.file && req.file.fieldname === 'logo') {
      if (shop.logo) {
        await deleteFromCloudinary(shop.logo);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'shop_management/shops', 'image');
      updateData.logo = result.secure_url;
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate a Shop
// @route   DELETE /api/v1/shops/:id
// @access  Private (Super Admin)
exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Shop not found', data: null });
    }

    // Soft delete the shop
    shop.isActive = false;
    await shop.save();

    // Reset active shop context for all users operating in this shop
    const usersInShop = await User.find({ shopId: shop._id });
    for (const user of usersInShop) {
      const alternativeShop = user.assignedShops.find(id => id.toString() !== shop._id.toString());
      if (alternativeShop) {
        user.shopId = alternativeShop;
      } else {
        user.shopId = null;
      }
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Shop successfully deactivated and user contexts reset',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
