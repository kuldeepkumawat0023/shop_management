const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, 'src/components/dashboard');

// The full list of components under src/components/dashboard
const componentsToScaffold = [
  'brands/BrandForm.tsx',
  'brands/BrandsView.tsx',
  'categories/CategoriesView.tsx',
  'categories/CategoryForm.tsx',
  'customers/CustomerDetailView.tsx',
  'customers/CustomerForm.tsx',
  'customers/CustomersView.tsx',
  'dashboard/DashboardView.tsx',
  'expenses/ExpenseForm.tsx',
  'expenses/ExpensesView.tsx',
  'inventory/InventoryView.tsx',
  'layout/DashboardLayout.tsx',
  'layout/ShopSwitcher.tsx',
  'layout/SideNavBar.tsx',
  'layout/TopNavBar.tsx',
  'manufacturing/ProductionLogView.tsx',
  'manufacturing/RecipeForm.tsx',
  'payments/PaymentForm.tsx',
  'payments/PaymentsView.tsx',
  'payroll/SalaryAdvanceForm.tsx',
  'payroll/StaffListView.tsx',
  'products/NewProductView.tsx',
  'products/ProductDetailView.tsx',
  'products/ProductsView.tsx',
  'purchases/NewPurchaseView.tsx',
  'purchases/PurchaseDetailView.tsx',
  'purchases/PurchasesView.tsx',
  'reports/GstReportView.tsx',
  'reports/ProfitReportView.tsx',
  'sales/SaleDetailView.tsx',
  'sales/SalesHistoryView.tsx',
  'settings/PreferencesView.tsx',
  'settings/RolesPermissionsView.tsx',
  'settings/SettingsView.tsx',
  'settings/StoreProfileView.tsx',
  'settings/TaxBillingView.tsx',
  'settings/UserProfileView.tsx',
  'suppliers/SupplierDetailView.tsx',
  'suppliers/SupplierForm.tsx',
  'suppliers/SuppliersView.tsx',
  'team/TeamMemberForm.tsx',
  'team/TeamMembersView.tsx',
  'users/UserForm.tsx',
  'users/UsersView.tsx'
];

let createdCount = 0;

componentsToScaffold.forEach(relPath => {
  const fullPath = path.join(compDir, relPath);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    
    const componentName = path.basename(relPath, '.tsx');
    const content = `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <div className="p-4 bg-surface rounded-xl border border-outline-variant/20">\n      <h2 className="text-lg font-semibold text-on-surface mb-2">${componentName}</h2>\n      <p className="text-on-surface-variant text-sm">This is a placeholder component for ${componentName}.</p>\n    </div>\n  );\n}\n`;
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Created component: ${fullPath}`);
    createdCount++;
  }
});

console.log(`\\nDone! Created ${createdCount} missing component files.`);
