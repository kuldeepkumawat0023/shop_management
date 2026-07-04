export const PERMISSIONS = {
  ALL: '*',

  // 1. Dashboard & Reports (Analytics)
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_REPORTS: 'VIEW_REPORTS',

  // 2. POS & Sales (Billing)
  CREATE_SALE: 'CREATE_SALE',
  VIEW_SALES: 'VIEW_SALES',
  DELETE_SALE: 'DELETE_SALE', // Voiding an invoice

  // 3. Inventory Management (Products)
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS', // Create/Edit/Delete products & adjust stock
  MANAGE_CATEGORIES_BRANDS: 'MANAGE_CATEGORIES_BRANDS',
  LOG_DAMAGE: 'LOG_DAMAGE', // Record damaged inventory

  // 4. Purchases & Suppliers
  CREATE_PURCHASE: 'CREATE_PURCHASE',
  VIEW_PURCHASES: 'VIEW_PURCHASES',
  MANAGE_SUPPLIERS: 'MANAGE_SUPPLIERS',

  // 5. Production & Recipes (Manufacturing)
  MANAGE_RECIPES: 'MANAGE_RECIPES',
  LOG_PRODUCTION: 'LOG_PRODUCTION',

  // 6. Financials (Expenses & Payments)
  MANAGE_EXPENSES: 'MANAGE_EXPENSES',
  MANAGE_PAYMENTS: 'MANAGE_PAYMENTS',

  // 7. People (CRM & Staff)
  MANAGE_CUSTOMERS: 'MANAGE_CUSTOMERS',
  MANAGE_TEAM: 'MANAGE_TEAM', // Invite/remove staff
  MANAGE_ROLES: 'MANAGE_ROLES', // Create/edit custom roles

  // 8. Shop Settings
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
};

export const PERMISSION_GROUPS = [
  {
    groupName: 'Dashboard & Reports',
    permissions: [
      { id: PERMISSIONS.VIEW_DASHBOARD, label: 'View Dashboard', description: 'Access to main dashboard metrics and charts' },
      { id: PERMISSIONS.VIEW_REPORTS, label: 'View Reports', description: 'Access to GSTR1 and other sales/purchase reports' },
    ]
  },
  {
    groupName: 'POS & Sales (Billing)',
    permissions: [
      { id: PERMISSIONS.CREATE_SALE, label: 'Create Sale (Billing)', description: 'Generate new invoices and handle POS transactions' },
      { id: PERMISSIONS.VIEW_SALES, label: 'View Sales History', description: 'View past invoices and daily sales register' },
      { id: PERMISSIONS.DELETE_SALE, label: 'Delete/Void Sale', description: 'Cancel or void a generated invoice (High Security)' },
    ]
  },
  {
    groupName: 'Inventory Management',
    permissions: [
      { id: PERMISSIONS.MANAGE_PRODUCTS, label: 'Manage Products', description: 'Create, edit, delete products and adjust stock levels' },
      { id: PERMISSIONS.MANAGE_CATEGORIES_BRANDS, label: 'Manage Categories & Brands', description: 'Organize products into categories and brands' },
      { id: PERMISSIONS.LOG_DAMAGE, label: 'Log Damage', description: 'Record damaged or expired inventory' },
    ]
  },
  {
    groupName: 'Purchases & Suppliers',
    permissions: [
      { id: PERMISSIONS.CREATE_PURCHASE, label: 'Record Purchase', description: 'Record inward stock from suppliers' },
      { id: PERMISSIONS.VIEW_PURCHASES, label: 'View Purchases', description: 'View purchase invoice history' },
      { id: PERMISSIONS.MANAGE_SUPPLIERS, label: 'Manage Suppliers', description: 'Add or edit supplier profiles and track balances' },
    ]
  },
  {
    groupName: 'Production (Manufacturing)',
    permissions: [
      { id: PERMISSIONS.MANAGE_RECIPES, label: 'Manage Recipes', description: 'Define how raw materials convert to final products' },
      { id: PERMISSIONS.LOG_PRODUCTION, label: 'Log Production', description: 'Run production batches to update inventory stock' },
    ]
  },
  {
    groupName: 'Financials',
    permissions: [
      { id: PERMISSIONS.MANAGE_EXPENSES, label: 'Manage Expenses', description: 'Record daily shop expenses (Tea, Rent, Salary, etc.)' },
      { id: PERMISSIONS.MANAGE_PAYMENTS, label: 'Manage Payments', description: 'Record Customer/Supplier incoming and outgoing payments' },
    ]
  },
  {
    groupName: 'People (CRM & Team)',
    permissions: [
      { id: PERMISSIONS.MANAGE_CUSTOMERS, label: 'Manage Customers', description: 'Add/Edit customer details and track credit/due amounts' },
      { id: PERMISSIONS.MANAGE_TEAM, label: 'Manage Team', description: 'Add/Remove staff members and update their salaries' },
      { id: PERMISSIONS.MANAGE_ROLES, label: 'Manage Roles', description: 'Create custom roles and assign these permissions' },
    ]
  },
  {
    groupName: 'Shop Configuration',
    permissions: [
      { id: PERMISSIONS.MANAGE_SETTINGS, label: 'Manage Shop Settings', description: 'Edit invoice prefix, tax type, print format, and shop details' },
    ]
  }
];
