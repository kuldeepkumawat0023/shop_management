const CustomRole = require('../models/CustomRole');
const { PERMISSION_LIST, PERMISSION_MODULES } = require('../config/permissions');

// @desc    Create a Custom Role
// @route   POST /api/v1/roles
// @access  Private (Super Admin / Shop Owner)
exports.createRole = async (req, res, next) => {
  try {
    const { roleName, description, permissions, shopId } = req.body;

    if (!roleName || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Role name and permissions array are required' });
    }

    // Validate permissions against available list
    const invalidPerms = permissions.filter(p => !PERMISSION_LIST.includes(p));
    if (invalidPerms.length > 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid permissions provided', data: invalidPerms });
    }

    let targetShopId = req.user.role === 'super_admin' ? (shopId || null) : req.scopedShopId;

    const role = await CustomRole.create({
      shopId: targetShopId,
      roleName,
      description,
      permissions,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Custom role created successfully',
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available permissions (grouped by module)
// @route   GET /api/v1/roles/permissions
// @access  Private
exports.getAllPermissions = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Permissions fetched successfully',
      data: PERMISSION_MODULES
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Custom Roles for the current shop
// @route   GET /api/v1/roles
// @access  Private
exports.getRoles = async (req, res, next) => {
  try {
    const query = { isActive: true };
    
    if (req.user.role !== 'super_admin') {
      // Return global custom roles (shopId: null) and shop specific roles
      query.$or = [{ shopId: req.scopedShopId }, { shopId: null }];
    }

    const customRoles = await CustomRole.find(query).populate('createdBy', 'fullname email');
    
    // Convert object of default roles to array and inject IDs
    const { ADMIN_DEFAULT_ROLES } = require('../config/permissions');
    const defaultRoles = Object.entries(ADMIN_DEFAULT_ROLES)
      .filter(([key]) => req.user.role === 'super_admin' || key !== 'SUPER_ADMIN')
      .map(([key, role]) => ({
        _id: key.toLowerCase(),
        ...role,
        isActive: true
      }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Roles fetched successfully',
      data: [...defaultRoles, ...customRoles]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Custom Role
// @route   PUT /api/v1/roles/:id
// @access  Private (Super Admin / Shop Owner)
exports.updateRole = async (req, res, next) => {
  try {
    const { roleName, description, permissions } = req.body;

    let role = await CustomRole.findById(req.params.id);

    if (!role || !role.isActive) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Role not found' });
    }

    // Security check
    if (req.user.role !== 'super_admin' && role.shopId?.toString() !== req.scopedShopId?.toString()) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to update this role' });
    }

    if (permissions) {
      const invalidPerms = permissions.filter(p => !PERMISSION_LIST.includes(p));
      if (invalidPerms.length > 0) {
        return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid permissions provided', data: invalidPerms });
      }
    }

    role = await CustomRole.findByIdAndUpdate(req.params.id, {
      roleName, description, permissions
    }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Custom Role
// @route   DELETE /api/v1/roles/:id
// @access  Private (Super Admin / Shop Owner)
exports.deleteRole = async (req, res, next) => {
  try {
    const role = await CustomRole.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Role not found' });
    }

    if (req.user.role !== 'super_admin' && role.shopId?.toString() !== req.scopedShopId?.toString()) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Unauthorized to delete this role' });
    }

    role.isActive = false;
    await role.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
