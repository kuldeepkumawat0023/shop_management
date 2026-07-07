const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token and set req.user
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Alternatively, check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Not authorized to access this route, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and exclude password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'The user belonging to this token does no longer exist.' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'Your account has been deactivated. Please contact support.' });
    }

    // Set user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Not authorized, token failed or expired' });
  }
};

/**
 * Grant access to specific roles
 * @param  {...String} roles - Array of roles allowed to access the route
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Super admin bypass
    if (req.user && req.user.role === 'super_admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        statusCode: 403, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

/**
 * Grant access to specific permissions
 * @param  {...String} permissions - Array of permissions allowed to access the route
 */
const authorizePermissions = (...permissions) => {
  return async (req, res, next) => {
    // Super admin bypass
    if (req.user && req.user.role === 'super_admin') {
      return next();
    }

    const { getPermissionsForUser } = require('../controllers/authController');
    const userPermissions = await getPermissionsForUser(req.user);

    const hasPermission = permissions.some(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles, authorizePermissions };
