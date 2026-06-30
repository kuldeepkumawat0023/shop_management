/**
 * Advanced Multi-Tenant Scope Middleware
 * Ensures that all queries/operations are strictly isolated to the user's Shop.
 */
const shopScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Not authorized' });
  }

  // 1. Super Admin Logic (Can access any shop if specified)
  if (req.user.role === 'super_admin') {
    // Check if super admin is trying to access a specific shop's data
    const targetShopId = req.query.shopId || req.body.shopId || req.params.shopId;
    
    // req.scopedShopId will be used globally in all controllers
    req.scopedShopId = targetShopId || null; // null means they are querying system-wide data
  } 
  
  // 2. Shop Owner, Manager, and Staff Logic (Strictly isolated to their own shop)
  else {
    if (!req.user.shopId) {
      return res.status(403).json({ 
        success: false, 
        statusCode: 403, 
        message: 'Security Alert: Your account is not linked to any active shop.' 
      });
    }

    req.scopedShopId = req.user.shopId;
    
    // Security Check: Prevent malicious users from injecting another shopId in request body
    if (req.body.shopId && req.body.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({ 
        success: false, 
        statusCode: 403, 
        message: 'Security Alert: You cannot perform actions for a different shop.' 
      });
    }

    // Forcefully overwrite body/query shopId to prevent accidental data leaks
    if (req.body) req.body.shopId = req.user.shopId;
    if (req.query && req.query.shopId) req.query.shopId = req.user.shopId.toString();
  }

  next();
};

module.exports = shopScope;
