import { z } from 'zod';

// Reusable basic schemas
const phoneRegex = /^[0-9]{10}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(phoneRegex, 'Invalid phone number (must be 10 digits)');

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// --- Shop Management Schemas ---

export const shopCreationSchema = z.object({
  name: z.string().min(1, 'Shop name is required').max(100, 'Shop name is too long'),
  email: emailSchema,
  contactNumber: phoneSchema,
  gstNumber: z
    .string()
    .optional()
    .refine((val) => !val || gstRegex.test(val.toUpperCase()), {
      message: 'Invalid GST number format',
    }),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address is too long'),
});

export type ShopCreationFormValues = z.infer<typeof shopCreationSchema>;

// --- Auth Schemas ---

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  captchaToken: z.string().optional(),
});

export const registerSchema = z.object({
  fullname: z.string().min(2, 'Full name is required').max(50, 'Name is too long'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  captchaToken: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// --- Dashboard Schemas ---

export const brandSchema = z.object({
  name: z.string().min(1, 'Brand Name is required / ब्रांड का नाम आवश्यक है').max(100, 'Brand Name is too long / ब्रांड का नाम बहुत लंबा है'),
  website: z.union([z.literal(''), z.string().url('Invalid URL format / अमान्य URL प्रारूप')]).optional(),
  contactPerson: z.string().max(100).optional(),
  category: z.string().optional(),
  description: z.string().max(500, 'Description is too long / विवरण बहुत लंबा है').optional(),
  status: z.enum(['Active', 'Inactive']),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category Name is required / श्रेणी का नाम आवश्यक है').max(100, 'Category Name is too long / श्रेणी का नाम बहुत लंबा है'),
  description: z.string().max(500, 'Description is too long / विवरण बहुत लंबा है').optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, 'Customer Name is required / ग्राहक का नाम आवश्यक है').max(100, 'Customer Name is too long / ग्राहक का नाम बहुत लंबा है'),
  phone: z.string().min(1, 'Phone number is required / फ़ोन नंबर आवश्यक है').regex(phoneRegex, 'Invalid phone number (must be 10 digits) / अमान्य फ़ोन नंबर (10 अंक होने चाहिए)'),
  email: z.union([z.literal(''), z.string().email('Invalid email address / अमान्य ईमेल पता')]).optional(),
  address: z.string().max(500, 'Address is too long / पता बहुत लंबा है').optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier Name is required / आपूर्तिकर्ता का नाम आवश्यक है').max(100, 'Supplier Name is too long / आपूर्तिकर्ता का नाम बहुत लंबा है'),
  contactPerson: z.string().min(1, 'Contact Person is required / संपर्क व्यक्ति आवश्यक है').max(100),
  phone: z.string().min(1, 'Phone number is required / फ़ोन नंबर आवश्यक है').regex(phoneRegex, 'Invalid phone number / अमान्य फ़ोन नंबर'),
  email: z.union([z.literal(''), z.string().email('Invalid email address / अमान्य ईमेल पता')]).optional(),
  gstNumber: z.union([
    z.literal(''),
    z.string().regex(gstRegex, 'Invalid GST number format / अमान्य GST नंबर प्रारूप')
  ]).optional(),
  address: z.string().max(500, 'Address is too long / पता बहुत लंबा है').optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product Name is required / उत्पाद का नाम आवश्यक है').max(100),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required / SKU आवश्यक है'),
  sellingPrice: z.number().min(0, 'Price must be positive / मूल्य सकारात्मक होना चाहिए'),
  costPrice: z.number().min(0).optional(),
  taxRate: z.number().min(0).optional(),
  currentStock: z.number().min(0).optional(),
  minStockLevel: z.number().min(0).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isActive: z.boolean().optional(),
});

// --- Manufacturing Schemas ---

export const recipeSchema = z.object({
  finalProductId: z.string().min(1, 'Output product is required / आउटपुट उत्पाद आवश्यक है'),
  ingredients: z.array(z.object({
    productId: z.string().min(1, 'Ingredient is required / सामग्री आवश्यक है'),
    quantityRequired: z.number().min(0.01, 'Quantity must be greater than 0 / मात्रा 0 से अधिक होनी चाहिए')
  })).min(1, 'At least one ingredient is required / कम से कम एक सामग्री आवश्यक है'),
  notes: z.string().optional()
});

export const productionSchema = z.object({
  recipeId: z.string().min(1, 'Recipe is required / रेसिपी आवश्यक है'),
  quantityProduced: z.number().min(1, 'Quantity must be at least 1 / मात्रा कम से कम 1 होनी चाहिए')
});

// --- Sales & Expenses Schemas ---

export const purchaseSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required / आपूर्तिकर्ता आवश्यक है'),
  items: z.array(z.object({
    product: z.string().min(1, 'Product is required / उत्पाद आवश्यक है'),
    quantity: z.number().min(0.01, 'Quantity must be greater than 0 / मात्रा 0 से अधिक होनी चाहिए'),
    unitPrice: z.number().min(0, 'Unit price cannot be negative / इकाई मूल्य नकारात्मक नहीं हो सकता')
  })).min(1, 'At least one item is required / कम से कम एक आइटम आवश्यक है'),
  shippingFee: z.number().optional(),
  taxAmount: z.number().optional(),
  discount: z.number().optional(),
  paymentStatus: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional()
});

export const expenseSchema = z.object({
  payee: z.string().min(1, 'Payee/Vendor is required / प्राप्तकर्ता/विक्रेता आवश्यक है'),
  category: z.string().min(1, 'Category is required / श्रेणी आवश्यक है'),
  amount: z.number().min(0.01, 'Amount must be greater than 0 / राशि 0 से अधिक होनी चाहिए'),
  date: z.string().min(1, 'Date is required / तिथि आवश्यक है'),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional()
});

// --- Payments Schema ---

export const paymentSchema = z.object({
  partyId: z.string().min(1, 'Party is required / पार्टी आवश्यक है'),
  paymentType: z.string().min(1, 'Payment type is required / भुगतान प्रकार आवश्यक है'),
  amount: z.number().min(0.01, 'Amount must be greater than 0 / राशि 0 से अधिक होनी चाहिए'),
  date: z.string().min(1, 'Date is required / तिथि आवश्यक है'),
  paymentMethod: z.string().min(1, 'Payment method is required / भुगतान विधि आवश्यक है'),
  referenceNo: z.string().optional(),
  notes: z.string().optional()
});

// --- HR & Payroll Schemas ---

export const userSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required / पूरा नाम आवश्यक है'),
  email: z.string().email('Invalid email address / अमान्य ईमेल पता'),
  phone: phoneSchema,
  role: z.string().min(1, 'Role is required / भूमिका आवश्यक है'),
  status: z.string().optional()
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required / नाम आवश्यक है'),
  position: z.string().min(1, 'Position is required / पद आवश्यक है'),
  department: z.string().optional(),
  salary: z.number().min(0, 'Salary cannot be negative / वेतन नकारात्मक नहीं हो सकता'),
  joinDate: z.string().min(1, 'Join Date is required / कार्यभार ग्रहण करने की तिथि आवश्यक है'),
  status: z.string().optional()
});

export const salarySchema = z.object({
  employeeId: z.string().min(1, 'Employee is required / कर्मचारी आवश्यक है'),
  month: z.string().min(1, 'Month is required / महीना आवश्यक है'),
  year: z.string().min(1, 'Year is required / वर्ष आवश्यक है'),
  baseSalary: z.number().min(0, 'Base salary cannot be negative / मूल वेतन नकारात्मक नहीं हो सकता'),
  bonuses: z.number().optional(),
  deductions: z.number().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required / भुगतान विधि आवश्यक है'),
  paymentDate: z.string().min(1, 'Payment date is required / भुगतान की तिथि आवश्यक है'),
  notes: z.string().optional()
});

export const advanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required / कर्मचारी आवश्यक है'),
  amount: z.number().min(0.01, 'Amount must be greater than 0 / राशि 0 से अधिक होनी चाहिए'),
  date: z.string().min(1, 'Date is required / तिथि आवश्यक है'),
  reason: z.string().optional(),
  repaymentTerm: z.string().optional(),
  emiAmount: z.number().optional()
});
