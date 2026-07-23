
const { ADMIN_DEFAULT_ROLES } = require('../config/permissions');

/**
 * Middleware to check if the user has a specific permission
 * @param {String} requiredPermission 
 */
const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      // Super Admin and Shop Owner bypass all permission checks
      if (req.user.role === 'super_admin' || req.user.role === 'shop_owner') {
        return next();
      }

      // Allow any user (even default staff) with NO assigned shops to create their first shop.
      // This solves issues for existing users who registered before the default role was changed to shop_owner.
      if (requiredPermission === 'shops.create' && !req.user.shopId && (!req.user.assignedShops || req.user.assignedShops.length === 0)) {
        return next();
      }

      let defaultPermissions = [];
      
      if (req.user.customRoleId) {
        const CustomRole = require('../models/CustomRole');
        const role = await CustomRole.findById(req.user.customRoleId).lean();
        if (role && role.isActive) {
          defaultPermissions = role.permissions || [];
        }
      } else {
        // Fallback to Default Role Permissions (Dynamic)
        const roleKey = req.user.role ? req.user.role.toUpperCase() : null;
        if (roleKey && ADMIN_DEFAULT_ROLES[roleKey]) {
          defaultPermissions = ADMIN_DEFAULT_ROLES[roleKey].permissions;
        }
      }

      if (!requiredPermission) {
        console.error('requirePermission called without a valid permission string');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
      }

      const hasGlobalWildcard = defaultPermissions.includes('*');
      const moduleName = requiredPermission.split('.')[0];
      const hasModuleWildcard = defaultPermissions.includes(`${moduleName}.*`);
      
      if (
        hasGlobalWildcard || 
        hasModuleWildcard || 
        defaultPermissions.includes(requiredPermission)
      ) {
        return next();
      }

      // Permission denied
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Requires permission: ${requiredPermission}` 
      });

    } catch (error) {
      console.error('Permission Middleware Error:', error);
      res.status(500).json({ success: false, message: 'Server Error verifying permissions' });
    }
  };
};

module.exports = requirePermission;
