/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RBAC Permission Registry — Single Source of Truth
 *
 * Format:  module.action  (e.g., "products.create", "users.view")
 * Wildcards:
 *   "*"       → superadmin bypass (all permissions)
 *   "pos.*"   → full access to the POS module
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─── All Granular Permission Tokens ──────────────────────────────────────────
const PERMISSIONS = {
  ALL: '*',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // POS Billing
  POS_VIEW: 'pos.view',
  POS_CREATE: 'pos.create',
  POS_UPDATE: 'pos.update',
  POS_DELETE: 'pos.delete',

  // Inventory & Products
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_DELETE: 'products.delete',
  
  CATEGORIES_VIEW: 'categories.view',
  CATEGORIES_CREATE: 'categories.create',
  CATEGORIES_UPDATE: 'categories.update',
  CATEGORIES_DELETE: 'categories.delete',
  
  BRANDS_VIEW: 'brands.view',
  BRANDS_CREATE: 'brands.create',
  BRANDS_UPDATE: 'brands.update',
  BRANDS_DELETE: 'brands.delete',

  // Damages
  DAMAGES_VIEW: 'damages.view',
  DAMAGES_CREATE: 'damages.create',
  DAMAGES_UPDATE: 'damages.update',
  DAMAGES_DELETE: 'damages.delete',

  // Manufacturing
  PRODUCTIONS_VIEW: 'productions.view',
  PRODUCTIONS_CREATE: 'productions.create',
  PRODUCTIONS_UPDATE: 'productions.update',
  PRODUCTIONS_DELETE: 'productions.delete',
  
  RECIPES_VIEW: 'recipes.view',
  RECIPES_CREATE: 'recipes.create',
  RECIPES_UPDATE: 'recipes.update',
  RECIPES_DELETE: 'recipes.delete',

  // Sales & Purchases
  SALES_VIEW: 'sales.view',
  SALES_CREATE: 'sales.create',
  SALES_UPDATE: 'sales.update',
  SALES_DELETE: 'sales.delete',

  PURCHASES_VIEW: 'purchases.view',
  PURCHASES_CREATE: 'purchases.create',
  PURCHASES_UPDATE: 'purchases.update',
  PURCHASES_DELETE: 'purchases.delete',

  EXPENSES_VIEW: 'expenses.view',
  EXPENSES_CREATE: 'expenses.create',
  EXPENSES_UPDATE: 'expenses.update',
  EXPENSES_DELETE: 'expenses.delete',

  // Parties
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_CREATE: 'customers.create',
  CUSTOMERS_UPDATE: 'customers.update',
  CUSTOMERS_DELETE: 'customers.delete',

  SUPPLIERS_VIEW: 'suppliers.view',
  SUPPLIERS_CREATE: 'suppliers.create',
  SUPPLIERS_UPDATE: 'suppliers.update',
  SUPPLIERS_DELETE: 'suppliers.delete',

  // HR & Team
  TEAM_VIEW: 'team.view',
  TEAM_CREATE: 'team.create',
  TEAM_UPDATE: 'team.update',
  TEAM_DELETE: 'team.delete',

  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Payroll
  PAYROLL_VIEW: 'payroll.view',
  PAYROLL_CREATE: 'payroll.create',
  PAYROLL_UPDATE: 'payroll.update',
  PAYROLL_DELETE: 'payroll.delete',

  // Payments
  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_CREATE: 'payments.create',
  PAYMENTS_UPDATE: 'payments.update',
  PAYMENTS_DELETE: 'payments.delete',

  // Reports
  REPORTS_VIEW: 'reports.view',

  // Settings & Roles
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',

  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',

  // Shops
  SHOPS_VIEW: 'shops.view',
  SHOPS_CREATE: 'shops.create',
  SHOPS_UPDATE: 'shops.update',
  SHOPS_DELETE: 'shops.delete',
};

// ─── Permission Modules (Grouped for Frontend UI) ────────────────────────────
const PERMISSION_MODULES = [
  {
    module: 'dashboard',
    label: 'Dashboard',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard' },
    ],
  },
  {
    module: 'shops',
    label: 'Shops & Multi-store',
    permissions: [
      { key: 'shops.view', label: 'View Shops' },
      { key: 'shops.create', label: 'Create Shops' },
      { key: 'shops.update', label: 'Edit Shops' },
      { key: 'shops.delete', label: 'Delete Shops' },
    ],
  },
  {
    module: 'pos',
    label: 'POS Billing',
    permissions: [
      { key: 'pos.view', label: 'View POS / Bills' },
      { key: 'pos.create', label: 'Create Bill (Checkout)' },
      { key: 'pos.update', label: 'Edit / Hold Bill' },
      { key: 'pos.delete', label: 'Delete / Cancel Bill' },
    ],
  },
  {
    module: 'products',
    label: 'Products',
    permissions: [
      { key: 'products.view', label: 'View Products' },
      { key: 'products.create', label: 'Add Product' },
      { key: 'products.update', label: 'Edit Product' },
      { key: 'products.delete', label: 'Delete Product' },
    ],
  },
  {
    module: 'categories',
    label: 'Categories',
    permissions: [
      { key: 'categories.view', label: 'View Categories' },
      { key: 'categories.create', label: 'Add Category' },
      { key: 'categories.update', label: 'Edit Category' },
      { key: 'categories.delete', label: 'Delete Category' },
    ],
  },
  {
    module: 'brands',
    label: 'Brands',
    permissions: [
      { key: 'brands.view', label: 'View Brands' },
      { key: 'brands.create', label: 'Add Brand' },
      { key: 'brands.update', label: 'Edit Brand' },
      { key: 'brands.delete', label: 'Delete Brand' },
    ],
  },
  {
    module: 'damages',
    label: 'Damages',
    permissions: [
      { key: 'damages.view', label: 'View Damages' },
      { key: 'damages.create', label: 'Log Damage' },
      { key: 'damages.update', label: 'Edit Damage' },
      { key: 'damages.delete', label: 'Delete Damage' },
    ],
  },
  {
    module: 'productions',
    label: 'Manufacturing / Productions',
    permissions: [
      { key: 'productions.view', label: 'View Productions' },
      { key: 'productions.create', label: 'Start Production' },
      { key: 'productions.update', label: 'Update Production' },
      { key: 'productions.delete', label: 'Delete Production' },
    ],
  },
  {
    module: 'recipes',
    label: 'Recipes',
    permissions: [
      { key: 'recipes.view', label: 'View Recipes' },
      { key: 'recipes.create', label: 'Create Recipe' },
      { key: 'recipes.update', label: 'Edit Recipe' },
      { key: 'recipes.delete', label: 'Delete Recipe' },
    ],
  },
  {
    module: 'sales',
    label: 'Sales',
    permissions: [
      { key: 'sales.view', label: 'View Sales' },
      { key: 'sales.create', label: 'Record Sale' },
      { key: 'sales.update', label: 'Edit Sale' },
      { key: 'sales.delete', label: 'Delete Sale' },
    ],
  },
  {
    module: 'purchases',
    label: 'Purchases',
    permissions: [
      { key: 'purchases.view', label: 'View Purchases' },
      { key: 'purchases.create', label: 'Record Purchase' },
      { key: 'purchases.update', label: 'Edit Purchase' },
      { key: 'purchases.delete', label: 'Delete Purchase' },
    ],
  },
  {
    module: 'expenses',
    label: 'Expenses',
    permissions: [
      { key: 'expenses.view', label: 'View Expenses' },
      { key: 'expenses.create', label: 'Record Expense' },
      { key: 'expenses.update', label: 'Edit Expense' },
      { key: 'expenses.delete', label: 'Delete Expense' },
    ],
  },
  {
    module: 'customers',
    label: 'Customers',
    permissions: [
      { key: 'customers.view', label: 'View Customers' },
      { key: 'customers.create', label: 'Add Customer' },
      { key: 'customers.update', label: 'Edit Customer' },
      { key: 'customers.delete', label: 'Delete Customer' },
    ],
  },
  {
    module: 'suppliers',
    label: 'Suppliers',
    permissions: [
      { key: 'suppliers.view', label: 'View Suppliers' },
      { key: 'suppliers.create', label: 'Add Supplier' },
      { key: 'suppliers.update', label: 'Edit Supplier' },
      { key: 'suppliers.delete', label: 'Delete Supplier' },
    ],
  },
  {
    module: 'team',
    label: 'HR & Team',
    permissions: [
      { key: 'team.view', label: 'View Team Members' },
      { key: 'team.create', label: 'Add Team Member' },
      { key: 'team.update', label: 'Edit Team Member' },
      { key: 'team.delete', label: 'Delete Team Member' },
    ],
  },
  {
    module: 'users',
    label: 'System Users',
    permissions: [
      { key: 'users.view', label: 'View System Users' },
      { key: 'users.create', label: 'Add System User' },
      { key: 'users.update', label: 'Edit System User' },
      { key: 'users.delete', label: 'Delete System User' },
    ],
  },
  {
    module: 'payroll',
    label: 'Payroll',
    permissions: [
      { key: 'payroll.view', label: 'View Payroll' },
      { key: 'payroll.create', label: 'Process Payroll' },
      { key: 'payroll.update', label: 'Edit Payroll' },
      { key: 'payroll.delete', label: 'Delete Payroll' },
    ],
  },
  {
    module: 'payments',
    label: 'Payments',
    permissions: [
      { key: 'payments.view', label: 'View Payments' },
      { key: 'payments.create', label: 'Record Payment' },
      { key: 'payments.update', label: 'Edit Payment' },
      { key: 'payments.delete', label: 'Delete Payment' },
    ],
  },
  {
    module: 'reports',
    label: 'Reports',
    permissions: [
      { key: 'reports.view', label: 'View Reports' },
    ],
  },
  {
    module: 'settings',
    label: 'Settings',
    permissions: [
      { key: 'settings.view', label: 'View Settings' },
      { key: 'settings.update', label: 'Update Settings' },
    ],
  },
  {
    module: 'roles',
    label: 'Roles & Permissions',
    permissions: [
      { key: 'roles.view', label: 'View Roles' },
      { key: 'roles.create', label: 'Create Role' },
      { key: 'roles.update', label: 'Edit Role' },
      { key: 'roles.delete', label: 'Delete Role' },
    ],
  },
];

// ─── Legacy Permission Mapping ───────────────────────────────────────────────
const LEGACY_MAP = {
  view_shops: ['shops.view'],
  manage_shops: ['shops.view', 'shops.create', 'shops.update', 'shops.delete'],
  
  view_inventory: ['products.view', 'categories.view', 'brands.view', 'damages.view'],
  manage_inventory: ['products.*', 'categories.*', 'brands.*', 'damages.*'],
  
  view_production: ['productions.view'],
  manage_production: ['productions.*'],
  
  view_recipes: ['recipes.view'],
  manage_recipes: ['recipes.*'],
  
  view_staff: ['team.view', 'users.view'],
  manage_staff: ['team.*', 'users.*'],
  
  view_payroll: ['payroll.view'],
  manage_payroll: ['payroll.*'],
  
  view_expenses: ['expenses.view'],
  manage_expenses: ['expenses.*'],
  
  view_reports: ['reports.view'],
  
  manage_settings: ['settings.view', 'settings.update'],
  manage_roles: ['roles.*'],
};

// ─── Default Role Templates ──────────────────────────────────────────────────
const ADMIN_DEFAULT_ROLES = {
  SUPER_ADMIN: {
    roleName: 'Super Admin',
    description: 'System master with all permissions',
    permissions: [PERMISSIONS.ALL],
    isDefault: true
  },
  SHOP_OWNER: {
    roleName: 'Shop Owner',
    description: 'Owner of the shop, has all permissions scoped to their shop',
    permissions: [PERMISSIONS.ALL],
    isDefault: true
  },
  MANAGER: {
    roleName: 'Manager',
    description: 'Shop manager who handles daily operations',
    permissions: [
      'dashboard.view', 
      'pos.*', 
      'products.*', 
      'categories.*', 
      'brands.*', 
      'productions.*', 
      'recipes.*', 
      'sales.*', 
      'purchases.*', 
      'expenses.*', 
      'customers.*', 
      'suppliers.*', 
      'team.*', 
      'payroll.*', 
      'payments.*', 
      'reports.view',
      'roles.*'
    ],
    isDefault: true
  },
  STAFF: {
    roleName: 'Staff',
    description: 'Basic staff member',
    permissions: [
      'dashboard.view',
      'pos.view', 
      'pos.create', 
      'products.view', 
      'sales.view'
    ],
    isDefault: true
  }
};

module.exports = {
  PERMISSIONS,
  PERMISSION_MODULES,
  LEGACY_MAP,
  ADMIN_DEFAULT_ROLES,
  // Ensure backward compat exports if any old files rely on ADMIN_PERMISSIONS directly
  ADMIN_PERMISSIONS: PERMISSIONS,
  PERMISSION_LIST: Object.values(PERMISSIONS),
};
