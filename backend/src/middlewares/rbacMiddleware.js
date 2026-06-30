
const { ADMIN_DEFAULT_ROLES } = require('../config/permissions');

/**
 * Advanced RBAC Middleware
 * Can verify if a user has ALL required permissions or ANY of the required permissions.
 */
const checkPermissions = (requiredPermissions, condition = 'ALL') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, statusCode: 401, message: 'Not authenticated' });
      }

      // Super Admin and Shop Owner always bypass
      if (req.user.role === 'super_admin' || req.user.role === 'shop_owner') {
        return next();
      }

      let userPerms = [];
      
      if (req.user.customRoleId) {
        const CustomRole = require('../models/CustomRole');
        const role = await CustomRole.findById(req.user.customRoleId).lean();
        if (role && role.isActive) {
          userPerms = role.permissions || [];
        }
      } else {
        // Fetch Default Role permissions
        if (req.user.role === 'manager') userPerms = ADMIN_DEFAULT_ROLES.MANAGER.permissions;
        else if (req.user.role === 'staff') userPerms = ADMIN_DEFAULT_ROLES.STAFF.permissions;
      }

      // Convert to array
      const permsToCheck = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

      // Evaluate conditions
      const hasAll = permsToCheck.every(p => userPerms.includes(p));
      const hasAny = permsToCheck.some(p => userPerms.includes(p));

      if (condition === 'ALL' && hasAll) return next();
      if (condition === 'ANY' && hasAny) return next();

      return res.status(403).json({ 
        success: false, 
        statusCode: 403, 
        message: `Access denied. Insufficient permissions. (Requires ${condition}: ${permsToCheck.join(' OR ')})` 
      });

    } catch (error) {
      console.error('Advanced RBAC Error:', error);
      res.status(500).json({ success: false, statusCode: 500, message: 'Server Error in RBAC verification' });
    }
  };
};

module.exports = {
  requireAllPermissions: (perms) => checkPermissions(perms, 'ALL'),
  requireAnyPermission: (perms) => checkPermissions(perms, 'ANY')
};
