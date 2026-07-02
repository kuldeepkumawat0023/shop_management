const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src/app/(dashboard)');
const compDir = path.join(__dirname, 'src/components/dashboard');

// Define the required routes and their corresponding views
const routes = {
  'brands/page.tsx': { viewDir: 'brands', viewName: 'BrandsView' },
  'categories/page.tsx': { viewDir: 'categories', viewName: 'CategoriesView' },
  'customers/page.tsx': { viewDir: 'customers', viewName: 'CustomersView' },
  'customers/[id]/page.tsx': { viewDir: 'customers', viewName: 'CustomerDetailView' },
  'expenses/page.tsx': { viewDir: 'expenses', viewName: 'ExpensesView' },
  'inventory/page.tsx': { viewDir: 'inventory', viewName: 'InventoryView' },
  'manufacturing/productions/page.tsx': { viewDir: 'manufacturing', viewName: 'ProductionLogView' },
  'manufacturing/recipes/page.tsx': { viewDir: 'manufacturing', viewName: 'RecipeForm' },
  'payments/page.tsx': { viewDir: 'payments', viewName: 'PaymentsView' },
  'payroll/advances/page.tsx': { viewDir: 'payroll', viewName: 'SalaryAdvanceForm' },
  'payroll/staff/page.tsx': { viewDir: 'payroll', viewName: 'StaffListView' },
  'products/new/page.tsx': { viewDir: 'products', viewName: 'NewProductView' },
  'products/page.tsx': { viewDir: 'products', viewName: 'ProductsView' },
  'products/[id]/page.tsx': { viewDir: 'products', viewName: 'ProductDetailView' },
  'purchases/new/page.tsx': { viewDir: 'purchases', viewName: 'NewPurchaseView' },
  'purchases/page.tsx': { viewDir: 'purchases', viewName: 'PurchasesView' },
  'purchases/[id]/page.tsx': { viewDir: 'purchases', viewName: 'PurchaseDetailView' },
  'reports/gst/page.tsx': { viewDir: 'reports', viewName: 'GstReportView' },
  'reports/profit/page.tsx': { viewDir: 'reports', viewName: 'ProfitReportView' },
  'sales/page.tsx': { viewDir: 'sales', viewName: 'SalesHistoryView' },
  'sales/[id]/page.tsx': { viewDir: 'sales', viewName: 'SaleDetailView' },
  'settings/billing/page.tsx': { viewDir: 'settings', viewName: 'TaxBillingView' },
  'settings/page.tsx': { viewDir: 'settings', viewName: 'SettingsView' },
  'settings/preferences/page.tsx': { viewDir: 'settings', viewName: 'PreferencesView' },
  'settings/profile/page.tsx': { viewDir: 'settings', viewName: 'UserProfileView' },
  'settings/roles/page.tsx': { viewDir: 'settings', viewName: 'RolesPermissionsView' },
  'settings/store/page.tsx': { viewDir: 'settings', viewName: 'StoreProfileView' },
  'suppliers/page.tsx': { viewDir: 'suppliers', viewName: 'SuppliersView' },
  'suppliers/[id]/page.tsx': { viewDir: 'suppliers', viewName: 'SupplierDetailView' },
  'team/page.tsx': { viewDir: 'team', viewName: 'TeamMembersView' },
  'users/page.tsx': { viewDir: 'users', viewName: 'UsersView' }
};

let createdCount = 0;

for (const [route, info] of Object.entries(routes)) {
  const pagePath = path.join(appDir, route);
  const viewPath = path.join(compDir, info.viewDir, `${info.viewName}.tsx`);
  
  // 1. Create View Component if it doesn't exist
  if (!fs.existsSync(viewPath)) {
    fs.mkdirSync(path.dirname(viewPath), { recursive: true });
    const viewContent = `import React from 'react';\n\nexport default function ${info.viewName}() {\n  return (\n    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full bg-surface">\n      <h2 className="text-2xl font-bold mb-4">${info.viewName}</h2>\n      <div className="glass-card p-6 border-outline-variant/20 shadow-sm">\n        <p className="text-on-surface-variant">Content for ${info.viewName} goes here.</p>\n      </div>\n    </div>\n  );\n}\n`;
    fs.writeFileSync(viewPath, viewContent, 'utf8');
    console.log(`Created view: ${viewPath}`);
    createdCount++;
  }
  
  // 2. Create Next.js Page if it doesn't exist
  if (!fs.existsSync(pagePath)) {
    fs.mkdirSync(path.dirname(pagePath), { recursive: true });
    // Determine the relative path for import
    const importPath = `@/components/dashboard/${info.viewDir}/${info.viewName}`;
    const pageContent = `import React from 'react';\nimport ${info.viewName} from '${importPath}';\n\nexport default function Page() {\n  return <${info.viewName} />;\n}\n`;
    fs.writeFileSync(pagePath, pageContent, 'utf8');
    console.log(`Created page: ${pagePath}`);
    createdCount++;
  }
}

console.log(`\nDone! Created ${createdCount} missing files.`);
