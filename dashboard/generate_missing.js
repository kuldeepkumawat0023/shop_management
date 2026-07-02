const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/components/dashboard');
const appDir = path.join(__dirname, 'src/app/(dashboard)');

const componentsToCreate = [
  'sales/SalesView',
  'customers/CustomersView',
  'manufacturing/ManufacturingView',
  'payroll/PayrollView',
  'reports/ReportsView',
  'settings/StoreProfileView',
  'settings/UserProfileView',
  'settings/RolesPermissionsView',
  'settings/TaxBillingView',
  'settings/PreferencesView'
];

const pagesToCreate = {
  'sales/page.tsx': { comp: 'SalesView', path: '@/components/dashboard/sales/SalesView' },
  'customers/page.tsx': { comp: 'CustomersView', path: '@/components/dashboard/customers/CustomersView' },
  'manufacturing/page.tsx': { comp: 'ManufacturingView', path: '@/components/dashboard/manufacturing/ManufacturingView' },
  'payroll/page.tsx': { comp: 'PayrollView', path: '@/components/dashboard/payroll/PayrollView' },
  'reports/page.tsx': { comp: 'ReportsView', path: '@/components/dashboard/reports/ReportsView' },
  'settings/store/page.tsx': { comp: 'StoreProfileView', path: '@/components/dashboard/settings/StoreProfileView' },
  'settings/profile/page.tsx': { comp: 'UserProfileView', path: '@/components/dashboard/settings/UserProfileView' },
  'settings/roles/page.tsx': { comp: 'RolesPermissionsView', path: '@/components/dashboard/settings/RolesPermissionsView' },
  'settings/billing/page.tsx': { comp: 'TaxBillingView', path: '@/components/dashboard/settings/TaxBillingView' },
  'settings/preferences/page.tsx': { comp: 'PreferencesView', path: '@/components/dashboard/settings/PreferencesView' }
};

// 1. Create missing components
componentsToCreate.forEach(compPath => {
  const fullPath = path.join(componentsDir, `${compPath}.tsx`);
  const dirPath = path.dirname(fullPath);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const componentName = path.basename(compPath);
  const content = `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <div className="p-6">\n      <h2 className="text-2xl font-bold mb-4">${componentName}</h2>\n      <div className="glass-panel p-6 rounded-xl">\n        <p className="text-on-surface-variant">Content for ${componentName} goes here.</p>\n      </div>\n    </div>\n  );\n}\n`;
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created component: ${compPath}.tsx`);
});

// 2. Create missing pages and wire them up
Object.keys(pagesToCreate).forEach(pageRoute => {
  const fullPath = path.join(appDir, pageRoute);
  const dirPath = path.dirname(fullPath);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const mapping = pagesToCreate[pageRoute];
  const content = `import React from 'react';\nimport ${mapping.comp} from '${mapping.path}';\n\nexport default function Page() {\n  return <${mapping.comp} />;\n}\n`;
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created page: ${pageRoute}`);
});

console.log("Done syncing missing files.");
