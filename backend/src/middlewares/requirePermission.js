
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

      let defaultPermissions = [];
      
      if (req.user.customRoleId) {
        const CustomRole = require('../models/CustomRole');
        const role = await CustomRole.findById(req.user.customRoleId).lean();
        if (role && role.isActive) {
          defaultPermissions = role.permissions || [];
        }
      } else {
        // Fallback to Default Role Permissions
        if (req.user.role === 'manager') {
          defaultPermissions = ADMIN_DEFAULT_ROLES.MANAGER.permissions;
        } else if (req.user.role === 'staff') {
          defaultPermissions = ADMIN_DEFAULT_ROLES.STAFF.permissions;
        }
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
