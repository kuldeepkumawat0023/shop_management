/**
 * Shop Management RBAC Permissions
 */
const ADMIN_PERMISSIONS = {
  // Shops
  MANAGE_SHOPS: 'manage_shops',
  VIEW_SHOPS: 'view_shops',

  // Inventory (Products & Raw Materials)
  MANAGE_INVENTORY: 'manage_inventory',
  VIEW_INVENTORY: 'view_inventory',
  
  // Production / Manufacturing
  MANAGE_PRODUCTION: 'manage_production',
  VIEW_PRODUCTION: 'view_production',
  
  // Recipes
  MANAGE_RECIPES: 'manage_recipes',
  VIEW_RECIPES: 'view_recipes',
  
  // Staff & Users
  MANAGE_STAFF: 'manage_staff',
  VIEW_STAFF: 'view_staff',
  
  // Payroll
  MANAGE_PAYROLL: 'manage_payroll',
  VIEW_PAYROLL: 'view_payroll',
  
  // Expenses & Purchases
  MANAGE_EXPENSES: 'manage_expenses',
  VIEW_EXPENSES: 'view_expenses',
  
  // Analytics & Reports
  VIEW_REPORTS: 'view_reports',
  
  // Settings & Roles
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_ROLES: 'manage_roles',
};

const PERMISSION_LIST = Object.values(ADMIN_PERMISSIONS);

const ADMIN_DEFAULT_ROLES = {
  SUPER_ADMIN: {
    roleName: 'Super Admin',
    description: 'System master with all permissions',
    permissions: PERMISSION_LIST,
    isDefault: true
  },
  SHOP_OWNER: {
    roleName: 'Shop Owner',
    description: 'Owner of the shop, has all permissions scoped to their shop',
    permissions: PERMISSION_LIST,
    isDefault: true
  },
  MANAGER: {
    roleName: 'Manager',
    description: 'Shop manager who handles daily operations',
    permissions: [
      ADMIN_PERMISSIONS.VIEW_SHOPS,
      ADMIN_PERMISSIONS.MANAGE_INVENTORY,
      ADMIN_PERMISSIONS.VIEW_INVENTORY,
      ADMIN_PERMISSIONS.MANAGE_PRODUCTION,
      ADMIN_PERMISSIONS.VIEW_PRODUCTION,
      ADMIN_PERMISSIONS.MANAGE_RECIPES,
      ADMIN_PERMISSIONS.VIEW_RECIPES,
      ADMIN_PERMISSIONS.MANAGE_STAFF,
      ADMIN_PERMISSIONS.VIEW_STAFF,
      ADMIN_PERMISSIONS.MANAGE_PAYROLL,
      ADMIN_PERMISSIONS.VIEW_PAYROLL,
      ADMIN_PERMISSIONS.MANAGE_EXPENSES,
      ADMIN_PERMISSIONS.VIEW_EXPENSES,
      ADMIN_PERMISSIONS.VIEW_REPORTS
    ],
    isDefault: true
  },
  STAFF: {
    roleName: 'Staff',
    description: 'Basic staff member',
    permissions: [
      ADMIN_PERMISSIONS.VIEW_INVENTORY,
      ADMIN_PERMISSIONS.VIEW_PRODUCTION,
      ADMIN_PERMISSIONS.VIEW_RECIPES
    ],
    isDefault: true
  }
};

module.exports = {
  ADMIN_PERMISSIONS,
  PERMISSIONS: ADMIN_PERMISSIONS,
  PERMISSION_LIST,
  ADMIN_DEFAULT_ROLES
};
