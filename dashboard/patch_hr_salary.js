import fs from 'fs';
import path from 'path';

const enPath = path.resolve('./src/locales/en.json');
const hiPath = path.resolve('./src/locales/hi.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!enData.hr) enData.hr = {};
if (!hiData.hr) hiData.hr = {};

enData.hr.salaryView = {
  loadError: "Failed to load salaries",
  netDisbursed: "Net Disbursed",
  lifetimePaid: "Lifetime paid",
  totalDeductions: "Total Deductions",
  leavesAdvances: "Leaves, advances, etc",
  pendingSalaries: "Pending Salaries",
  awaitingPayment: "Awaiting payment",
  salaryRecords: "Salary Records",
  totalProcessed: "Total processed",
  id: "ID",
  employee: "Employee",
  unknown: "Unknown",
  baseSalary: "Base Salary",
  deductions: "Deductions",
  netSalary: "Net Salary",
  paymentDate: "Payment Date",
  status: "Status",
  actions: "Actions",
  processPayment: "Process Payment",
  staffSalary: "Staff Salary",
  managePayroll: "Manage employee payroll and track monthly disbursements.",
  exportPayroll: "Export Payroll",
  processSalary: "Process Salary",
  searchPlaceholder: "Search employee name...",
  filters: "Filters"
};

hiData.hr.salaryView = {
  loadError: "वेतन लोड करने में विफल",
  netDisbursed: "शुद्ध वितरित",
  lifetimePaid: "आजीवन भुगतान",
  totalDeductions: "कुल कटौती",
  leavesAdvances: "छुट्टियां, अग्रिम आदि",
  pendingSalaries: "लंबित वेतन",
  awaitingPayment: "भुगतान की प्रतीक्षा में",
  salaryRecords: "वेतन रिकॉर्ड",
  totalProcessed: "कुल संसाधित",
  id: "आईडी",
  employee: "कर्मचारी",
  unknown: "अज्ञात",
  baseSalary: "मूल वेतन",
  deductions: "कटौती",
  netSalary: "शुद्ध वेतन",
  paymentDate: "भुगतान तिथि",
  status: "स्थिति",
  actions: "कार्रवाई",
  processPayment: "भुगतान संसाधित करें",
  staffSalary: "स्टाफ का वेतन",
  managePayroll: "कर्मचारी पेरोल प्रबंधित करें और मासिक संवितरण को ट्रैक करें।",
  exportPayroll: "पेरोल निर्यात करें",
  processSalary: "वेतन संसाधित करें",
  searchPlaceholder: "कर्मचारी का नाम खोजें...",
  filters: "फ़िल्टर"
};

enData.hr.paySalaryForm = {
  loadError: "Failed to load staff list",
  pleaseCorrectErrors: "Please correct the errors",
  processingSalary: "Processing salary...",
  salaryProcessed: "Salary processed successfully!",
  failedToProcess: "Failed to process salary",
  processSalary: "Process Salary",
  recordPaymentMsg: "Record salary payment for an employee",
  payrollDetails: "Payroll Details",
  employee: "Employee",
  selectEmployee: "Select employee...",
  salaryMonth: "Salary Month",
  baseSalary: "Base Salary (₹)",
  bonuses: "Bonuses / Allowances (₹)",
  deductions: "Deductions (₹) e.g. Advance, Leaves",
  netSalaryPayable: "Net Salary Payable",
  paymentInfo: "Payment Information",
  paymentMethod: "Payment Method",
  paymentDate: "Payment Date",
  internalRemarks: "Internal Remarks",
  remarksPlaceholder: "e.g. UTR Number, or reasoning for deductions...",
  bankTransfer: "Bank Transfer (NEFT/RTGS)",
  upi: "UPI",
  cheque: "Cheque",
  cash: "Cash",
  clearForm: "Clear Form",
  cancel: "Cancel",
  processing: "Processing...",
  confirmPayment: "Confirm Payment"
};

hiData.hr.paySalaryForm = {
  loadError: "कर्मचारी सूची लोड करने में विफल",
  pleaseCorrectErrors: "कृपया त्रुटियों को ठीक करें",
  processingSalary: "वेतन संसाधित किया जा रहा है...",
  salaryProcessed: "वेतन सफलतापूर्वक संसाधित!",
  failedToProcess: "वेतन संसाधित करने में विफल",
  processSalary: "वेतन संसाधित करें",
  recordPaymentMsg: "कर्मचारी के लिए वेतन भुगतान रिकॉर्ड करें",
  payrollDetails: "पेरोल विवरण",
  employee: "कर्मचारी",
  selectEmployee: "कर्मचारी चुनें...",
  salaryMonth: "वेतन माह",
  baseSalary: "मूल वेतन (₹)",
  bonuses: "बोनस / भत्ते (₹)",
  deductions: "कटौती (₹) उदा. अग्रिम, छुट्टियां",
  netSalaryPayable: "देय शुद्ध वेतन",
  paymentInfo: "भुगतान की जानकारी",
  paymentMethod: "भुगतान विधि",
  paymentDate: "भुगतान तिथि",
  internalRemarks: "आंतरिक टिप्पणियां",
  remarksPlaceholder: "उदा. यूटीआर नंबर, या कटौती का कारण...",
  bankTransfer: "बैंक ट्रांसफर (NEFT/RTGS)",
  upi: "यूपीआई",
  cheque: "चेक",
  cash: "नकद",
  clearForm: "फ़ॉर्म साफ़ करें",
  cancel: "रद्द करें",
  processing: "संसाधित किया जा रहा है...",
  confirmPayment: "भुगतान की पुष्टि करें"
};

enData.hr.salaryAdvancesView = {
  loadError: "Failed to load advances",
  totalAdvanced: "Total Advanced",
  lifetimeDisbursed: "Lifetime disbursed",
  activeApproved: "Active (Approved)",
  awaitingSettlement: "Awaiting settlement",
  pendingRequests: "Pending Requests",
  needsReview: "Needs review",
  settled: "Settled",
  fullyRecovered: "Fully recovered",
  refId: "Ref ID",
  employee: "Employee",
  amount: "Amount",
  dateRequested: "Date Requested",
  repaymentTerms: "Repayment Terms",
  status: "Status",
  actions: "Actions",
  perMonth: "/mo",
  salaryAdvances: "Salary Advances",
  manageAdvances: "Manage employee advance requests and EMI deductions.",
  exportData: "Export Data",
  grantAdvance: "Grant Advance",
  searchPlaceholder: "Search employee name...",
  filters: "Filters"
};

hiData.hr.salaryAdvancesView = {
  loadError: "अग्रिम लोड करने में विफल",
  totalAdvanced: "कुल उन्नत",
  lifetimeDisbursed: "आजीवन वितरित",
  activeApproved: "सक्रिय (स्वीकृत)",
  awaitingSettlement: "निपटान की प्रतीक्षा में",
  pendingRequests: "लंबित अनुरोध",
  needsReview: "समीक्षा की आवश्यकता है",
  settled: "निपटाया गया",
  fullyRecovered: "पूरी तरह से वसूल किया गया",
  refId: "संदर्भ आईडी",
  employee: "कर्मचारी",
  amount: "राशि",
  dateRequested: "अनुरोध की तिथि",
  repaymentTerms: "चुकौती शर्तें",
  status: "स्थिति",
  actions: "कार्रवाई",
  perMonth: "/माह",
  salaryAdvances: "वेतन अग्रिम",
  manageAdvances: "कर्मचारी अग्रिम अनुरोधों और ईएमआई कटौती का प्रबंधन करें।",
  exportData: "डेटा निर्यात करें",
  grantAdvance: "अग्रिम दें",
  searchPlaceholder: "कर्मचारी का नाम खोजें...",
  filters: "फ़िल्टर"
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));

// Patch StaffSalaryView.tsx
let ssvPath = path.resolve('./src/components/dashboard/payroll/salary/StaffSalaryView.tsx');
let ssvContent = fs.readFileSync(ssvPath, 'utf8');
if (!ssvContent.includes('useTranslation')) {
  ssvContent = ssvContent.replace(
    "import { payrollService } from '@/lib/services/payroll.services';",
    "import { payrollService } from '@/lib/services/payroll.services';\nimport { useTranslation } from 'react-i18next';"
  );
  ssvContent = ssvContent.replace(
    "export default function StaffSalaryView() {",
    "export default function StaffSalaryView() {\n  const { t } = useTranslation();"
  );
  
  ssvContent = ssvContent.replace(
    /'Failed to load salaries'/g,
    "t('hr.salaryView.loadError')"
  );
  
  ssvContent = ssvContent.replace(
    /title: "Net Disbursed"/g,
    "title: t('hr.salaryView.netDisbursed')"
  );
  ssvContent = ssvContent.replace(
    /trend: "Lifetime paid"/g,
    "trend: t('hr.salaryView.lifetimePaid')"
  );
  ssvContent = ssvContent.replace(
    /title: "Total Deductions"/g,
    "title: t('hr.salaryView.totalDeductions')"
  );
  ssvContent = ssvContent.replace(
    /trend: "Leaves, advances, etc"/g,
    "trend: t('hr.salaryView.leavesAdvances')"
  );
  ssvContent = ssvContent.replace(
    /title: "Pending Salaries"/g,
    "title: t('hr.salaryView.pendingSalaries')"
  );
  ssvContent = ssvContent.replace(
    /trend: "Awaiting payment"/g,
    "trend: t('hr.salaryView.awaitingPayment')"
  );
  ssvContent = ssvContent.replace(
    /title: "Salary Records"/g,
    "title: t('hr.salaryView.salaryRecords')"
  );
  ssvContent = ssvContent.replace(
    /trend: "Total processed"/g,
    "trend: t('hr.salaryView.totalProcessed')"
  );
  
  ssvContent = ssvContent.replace(
    /header: 'ID'/g,
    "header: t('hr.salaryView.id')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Employee'/g,
    "header: t('hr.salaryView.employee')"
  );
  ssvContent = ssvContent.replace(
    /'Unknown'/g,
    "t('hr.salaryView.unknown')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Base Salary'/g,
    "header: t('hr.salaryView.baseSalary')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Deductions'/g,
    "header: t('hr.salaryView.deductions')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Net Salary'/g,
    "header: t('hr.salaryView.netSalary')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Payment Date'/g,
    "header: t('hr.salaryView.paymentDate')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Status'/g,
    "header: t('hr.salaryView.status')"
  );
  ssvContent = ssvContent.replace(
    /header: 'Actions'/g,
    "header: t('hr.salaryView.actions')"
  );
  ssvContent = ssvContent.replace(
    /title="Process Payment"/g,
    "title={t('hr.salaryView.processPayment')}"
  );
  
  ssvContent = ssvContent.replace(
    />Staff Salary<\/h2>/g,
    ">{t('hr.salaryView.staffSalary')}<\/h2>"
  );
  ssvContent = ssvContent.replace(
    />Manage employee payroll and track monthly disbursements\.<\/p>/g,
    ">{t('hr.salaryView.managePayroll')}<\/p>"
  );
  ssvContent = ssvContent.replace(
    />\s*Export Payroll\n/g,
    ">\n            {t('hr.salaryView.exportPayroll')}\n"
  );
  ssvContent = ssvContent.replace(
    />\s*Process Salary\n/g,
    ">\n              {t('hr.salaryView.processSalary')}\n"
  );
  ssvContent = ssvContent.replace(
    /placeholder="Search employee name\.\.\."/g,
    "placeholder={t('hr.salaryView.searchPlaceholder')}"
  );
  ssvContent = ssvContent.replace(
    />\s*Filters\n/g,
    ">\n            {t('hr.salaryView.filters')}\n"
  );

  fs.writeFileSync(ssvPath, ssvContent);
}

// Patch PaySalaryForm.tsx
let psfPath = path.resolve('./src/components/dashboard/payroll/salary/PaySalaryForm.tsx');
let psfContent = fs.readFileSync(psfPath, 'utf8');
if (!psfContent.includes('useTranslation')) {
  psfContent = psfContent.replace(
    "import { payrollService } from '@/lib/services/payroll.services';",
    "import { payrollService } from '@/lib/services/payroll.services';\nimport { useTranslation } from 'react-i18next';"
  );
  psfContent = psfContent.replace(
    "export default function PaySalaryForm() {",
    "export default function PaySalaryForm() {\n  const { t } = useTranslation();"
  );
  
  psfContent = psfContent.replace(
    /'Failed to load staff list \/ कर्मचारी सूची लोड करने में विफल'/g,
    "t('hr.paySalaryForm.loadError')"
  );
  psfContent = psfContent.replace(
    /'Please correct the errors \/ कृपया त्रुटियों को ठीक करें'/g,
    "t('hr.paySalaryForm.pleaseCorrectErrors')"
  );
  psfContent = psfContent.replace(
    /'Processing salary\.\.\. \/ वेतन संसाधित किया जा रहा है\.\.\.'/g,
    "t('hr.paySalaryForm.processingSalary')"
  );
  psfContent = psfContent.replace(
    /'Salary processed successfully! \/ वेतन सफलतापूर्वक संसाधित!'/g,
    "t('hr.paySalaryForm.salaryProcessed')"
  );
  psfContent = psfContent.replace(
    /'Failed to process salary \/ वेतन संसाधित करने में विफल'/g,
    "t('hr.paySalaryForm.failedToProcess')"
  );
  
  psfContent = psfContent.replace(
    />Process Salary \/ वेतन संसाधित करें<\/h1>/g,
    ">{t('hr.paySalaryForm.processSalary')}<\/h1>"
  );
  psfContent = psfContent.replace(
    />Record salary payment for an employee \/ कर्मचारी के लिए वेतन भुगतान रिकॉर्ड करें<\/p>/g,
    ">{t('hr.paySalaryForm.recordPaymentMsg')}<\/p>"
  );
  
  psfContent = psfContent.replace(
    />Payroll Details<\/h2>/g,
    ">{t('hr.paySalaryForm.payrollDetails')}<\/h2>"
  );
  psfContent = psfContent.replace(
    />Employee \/ कर्मचारी /g,
    ">{t('hr.paySalaryForm.employee')} "
  );
  psfContent = psfContent.replace(
    />Select employee\.\.\. \/ कर्मचारी चुनें\.\.\.<\/option>/g,
    ">{t('hr.paySalaryForm.selectEmployee')}<\/option>"
  );
  psfContent = psfContent.replace(
    />Salary Month \/ वेतन माह /g,
    ">{t('hr.paySalaryForm.salaryMonth')} "
  );
  psfContent = psfContent.replace(
    />Base Salary \(₹\) \/ मूल वेतन /g,
    ">{t('hr.paySalaryForm.baseSalary')} "
  );
  psfContent = psfContent.replace(
    />Bonuses \/ Allowances \(₹\) \/ बोनस<\/label>/g,
    ">{t('hr.paySalaryForm.bonuses')}<\/label>"
  );
  psfContent = psfContent.replace(
    />Deductions \(₹\) e\.g\. Advance, Leaves \/ कटौती<\/label>/g,
    ">{t('hr.paySalaryForm.deductions')}<\/label>"
  );
  
  psfContent = psfContent.replace(
    />Net Salary Payable \/ देय शुद्ध वेतन<\/h3>/g,
    ">{t('hr.paySalaryForm.netSalaryPayable')}<\/h3>"
  );
  psfContent = psfContent.replace(
    />Payment Information \/ भुगतान की जानकारी<\/h2>/g,
    ">{t('hr.paySalaryForm.paymentInfo')}<\/h2>"
  );
  psfContent = psfContent.replace(
    />Payment Method \/ भुगतान विधि /g,
    ">{t('hr.paySalaryForm.paymentMethod')} "
  );
  psfContent = psfContent.replace(
    />Payment Date \/ भुगतान तिथि /g,
    ">{t('hr.paySalaryForm.paymentDate')} "
  );
  psfContent = psfContent.replace(
    />Internal Remarks \/ आंतरिक टिप्पणियां<\/label>/g,
    ">{t('hr.paySalaryForm.internalRemarks')}<\/label>"
  );
  psfContent = psfContent.replace(
    /placeholder="e\.g\. UTR Number, or reasoning for deductions\.\.\."/g,
    "placeholder={t('hr.paySalaryForm.remarksPlaceholder')}"
  );
  
  psfContent = psfContent.replace(
    />Bank Transfer \(NEFT\/RTGS\)<\/option>/g,
    ">{t('hr.paySalaryForm.bankTransfer')}<\/option>"
  );
  psfContent = psfContent.replace(
    />UPI<\/option>/g,
    ">{t('hr.paySalaryForm.upi')}<\/option>"
  );
  psfContent = psfContent.replace(
    />Cheque<\/option>/g,
    ">{t('hr.paySalaryForm.cheque')}<\/option>"
  );
  psfContent = psfContent.replace(
    />Cash<\/option>/g,
    ">{t('hr.paySalaryForm.cash')}<\/option>"
  );
  
  psfContent = psfContent.replace(
    />\s*Clear Form \/ साफ़ करें\n/g,
    ">\n            {t('hr.paySalaryForm.clearForm')}\n"
  );
  psfContent = psfContent.replace(
    />\s*Cancel \/ रद्द करें\n/g,
    ">\n            {t('hr.paySalaryForm.cancel')}\n"
  );
  psfContent = psfContent.replace(
    /\{submitting \? 'Processing\.\.\. \/ संसाधित किया जा रहा है\.\.\.' : 'Confirm Payment \/ भुगतान की पुष्टि करें'\}/g,
    "{submitting ? t('hr.paySalaryForm.processing') : t('hr.paySalaryForm.confirmPayment')}"
  );

  fs.writeFileSync(psfPath, psfContent);
}

// Patch SalaryAdvancesView.tsx
let savPath = path.resolve('./src/components/dashboard/payroll/advances/SalaryAdvancesView.tsx');
let savContent = fs.readFileSync(savPath, 'utf8');
if (!savContent.includes('useTranslation')) {
  savContent = savContent.replace(
    "import { payrollService } from '@/lib/services/payroll.services';",
    "import { payrollService } from '@/lib/services/payroll.services';\nimport { useTranslation } from 'react-i18next';"
  );
  savContent = savContent.replace(
    "export default function SalaryAdvancesView() {",
    "export default function SalaryAdvancesView() {\n  const { t } = useTranslation();"
  );
  
  savContent = savContent.replace(
    /'Failed to load advances'/g,
    "t('hr.salaryAdvancesView.loadError')"
  );
  
  savContent = savContent.replace(
    /title: "Total Advanced"/g,
    "title: t('hr.salaryAdvancesView.totalAdvanced')"
  );
  savContent = savContent.replace(
    /trend: "Lifetime disbursed"/g,
    "trend: t('hr.salaryAdvancesView.lifetimeDisbursed')"
  );
  savContent = savContent.replace(
    /title: "Active \(Approved\)"/g,
    "title: t('hr.salaryAdvancesView.activeApproved')"
  );
  savContent = savContent.replace(
    /trend: "Awaiting settlement"/g,
    "trend: t('hr.salaryAdvancesView.awaitingSettlement')"
  );
  savContent = savContent.replace(
    /title: "Pending Requests"/g,
    "title: t('hr.salaryAdvancesView.pendingRequests')"
  );
  savContent = savContent.replace(
    /trend: "Needs review"/g,
    "trend: t('hr.salaryAdvancesView.needsReview')"
  );
  savContent = savContent.replace(
    /title: "Settled"/g,
    "title: t('hr.salaryAdvancesView.settled')"
  );
  savContent = savContent.replace(
    /trend: "Fully recovered"/g,
    "trend: t('hr.salaryAdvancesView.fullyRecovered')"
  );
  
  savContent = savContent.replace(
    /header: 'Ref ID'/g,
    "header: t('hr.salaryAdvancesView.refId')"
  );
  savContent = savContent.replace(
    /header: 'Employee'/g,
    "header: t('hr.salaryAdvancesView.employee')"
  );
  savContent = savContent.replace(
    /'Unknown'/g,
    "t('hr.salaryView.unknown')"
  );
  savContent = savContent.replace(
    /header: 'Amount'/g,
    "header: t('hr.salaryAdvancesView.amount')"
  );
  savContent = savContent.replace(
    /header: 'Date Requested'/g,
    "header: t('hr.salaryAdvancesView.dateRequested')"
  );
  savContent = savContent.replace(
    /header: 'Repayment Terms'/g,
    "header: t('hr.salaryAdvancesView.repaymentTerms')"
  );
  savContent = savContent.replace(
    /header: 'Status'/g,
    "header: t('hr.salaryAdvancesView.status')"
  );
  savContent = savContent.replace(
    /header: 'Actions'/g,
    "header: t('hr.salaryAdvancesView.actions')"
  );
  savContent = savContent.replace(
    /`₹\$\{row\.emiAmount\}\/mo`/g,
    "`₹${row.emiAmount}${t('hr.salaryAdvancesView.perMonth')}`"
  );
  
  savContent = savContent.replace(
    />Salary Advances<\/h2>/g,
    ">{t('hr.salaryAdvancesView.salaryAdvances')}<\/h2>"
  );
  savContent = savContent.replace(
    />Manage employee advance requests and EMI deductions\.<\/p>/g,
    ">{t('hr.salaryAdvancesView.manageAdvances')}<\/p>"
  );
  savContent = savContent.replace(
    />\s*Export Data\n/g,
    ">\n            {t('hr.salaryAdvancesView.exportData')}\n"
  );
  savContent = savContent.replace(
    />\s*Grant Advance\n/g,
    ">\n              {t('hr.salaryAdvancesView.grantAdvance')}\n"
  );
  savContent = savContent.replace(
    /placeholder="Search employee name\.\.\."/g,
    "placeholder={t('hr.salaryAdvancesView.searchPlaceholder')}"
  );
  savContent = savContent.replace(
    />\s*Filters\n/g,
    ">\n            {t('hr.salaryAdvancesView.filters')}\n"
  );

  fs.writeFileSync(savPath, savContent);
}

console.log("HR Salary group patched.");
