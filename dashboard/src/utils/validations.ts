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

