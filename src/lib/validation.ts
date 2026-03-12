import { z } from "zod";

// =====================================================
// SMART FUNDI INPUT VALIDATION & SANITIZATION
// =====================================================

// Sanitization utilities
export const sanitize = {
  // Strip HTML and script tags
  stripHtml: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
  },

  // Trim whitespace and normalize
  trim: (input: string): string => {
    return input.trim().replace(/\s+/g, " ");
  },

  // Normalize Unicode (NFC normalization)
  normalizeUnicode: (input: string): string => {
    return input.normalize("NFC");
  },

  // Full sanitization pipeline
  full: (input: string): string => {
    return sanitize.normalizeUnicode(sanitize.trim(sanitize.stripHtml(input)));
  },

  // Sanitize object recursively
  object: <T extends Record<string, unknown>>(obj: T): T => {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        sanitized[key] = sanitize.full(value);
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitize.object(value as Record<string, unknown>);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string" ? sanitize.full(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized as T;
  },
};

// =====================================================
// TANZANIAN-SPECIFIC VALIDATION PATTERNS
// =====================================================

// Tanzanian phone number: +255 followed by 6 or 7, then 8 digits
// Supports: Vodacom (74, 75, 76), Airtel (68, 69, 78, 79), Tigo (71, 72, 65, 67), Halotel (62)
export const TANZANIAN_PHONE_REGEX = /^\+255[67]\d{8}$/;

// Alternative format without + prefix
export const TANZANIAN_PHONE_LOCAL_REGEX = /^0[67]\d{8}$/;

// National ID: 16+ alphanumeric characters
export const NATIONAL_ID_REGEX = /^[A-Z0-9]{16,}$/i;

// Email validation (RFC 5322 compliant)
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Name validation: 2-50 chars, letters, spaces, hyphens, apostrophes only
export const NAME_REGEX = /^[a-zA-Z\s\-'À-ÿ]{2,50}$/;

// USSD code validation
export const USSD_REGEX = /^\*\d{3}\*\d{2,3}#$/;

// =====================================================
// ZOD VALIDATION SCHEMAS
// =====================================================

// Phone number schema (Tanzanian format)
export const phoneSchema = z
  .string()
  .transform((val) => {
    // Normalize phone number
    let phone = val.replace(/\s+/g, "").replace(/-/g, "");
    // Convert local format to international
    if (phone.startsWith("0")) {
      phone = "+255" + phone.slice(1);
    }
    // Add + if missing
    if (phone.startsWith("255")) {
      phone = "+" + phone;
    }
    return phone;
  })
  .refine((val) => TANZANIAN_PHONE_REGEX.test(val), {
    message: "Nambari ya simu si sahihi. Tumia muundo: +255XXXXXXXXX / Invalid phone number. Use format: +255XXXXXXXXX",
  });

// Email schema
export const emailSchema = z
  .string()
  .email({ message: "Barua pepe si sahihi / Invalid email address" })
  .max(254, { message: "Barua pepe ni ndefu sana / Email is too long" })
  .transform((val) => val.toLowerCase().trim());

// Name schema (2-50 characters, no special symbols)
export const nameSchema = z
  .string()
  .min(2, { message: "Jina lazima liwe na herufi 2 au zaidi / Name must be at least 2 characters" })
  .max(50, { message: "Jina lazima liwe na herufi 50 au chini / Name must be 50 characters or less" })
  .transform((val) => sanitize.full(val))
  .refine((val) => NAME_REGEX.test(val), {
    message: "Jina lina herufi zisizoruhusiwa / Name contains invalid characters",
  });

// National ID schema (16+ alphanumeric)
export const nationalIdSchema = z
  .string()
  .min(16, { message: "Kitambulisho lazima kiwe na herufi 16 au zaidi / ID must be at least 16 characters" })
  .transform((val) => val.toUpperCase().replace(/\s+/g, ""))
  .refine((val) => NATIONAL_ID_REGEX.test(val), {
    message: "Kitambulisho si sahihi / Invalid ID format",
  });

// Password schema (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const passwordSchema = z
  .string()
  .min(8, { message: "Nenosiri lazima liwe na herufi 8 au zaidi / Password must be at least 8 characters" })
  .max(128, { message: "Nenosiri ni refu sana / Password is too long" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Nenosiri lazima liwe na herufi kubwa moja / Password must contain an uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Nenosiri lazima liwe na herufi ndogo moja / Password must contain a lowercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Nenosiri lazima liwe na nambari moja / Password must contain a number",
  });

// Amount schema (positive integers only, in TZS)
export const amountSchema = z
  .number()
  .int({ message: "Kiasi lazima kiwe nambari kamili / Amount must be a whole number" })
  .positive({ message: "Kiasi lazima kiwe chanya / Amount must be positive" })
  .max(100000000, { message: "Kiasi ni kubwa sana / Amount is too large" });

// City schema (Tanzanian cities)
export const TANZANIAN_CITIES = [
  "Dar es Salaam",
  "Arusha",
  "Mwanza",
  "Dodoma",
  "Mbeya",
  "Morogoro",
  "Tanga",
  "Zanzibar",
  "Kigoma",
  "Moshi",
  "Iringa",
  "Tabora",
  "Singida",
  "Shinyanga",
  "Sumbawanga",
  "Bukoba",
  "Musoma",
  "Songea",
  "Lindi",
  "Mtwara",
] as const;

export const citySchema = z.enum(TANZANIAN_CITIES, {
  errorMap: () => ({ message: "Jiji halijulikani / Unknown city" }),
});

// User role schema
export const userRoleSchema = z.enum(["customer", "fundi", "shop", "admin"], {
  errorMap: () => ({ message: "Aina ya mtumiaji haijulikani / Unknown user type" }),
});

// Bio/description schema
export const bioSchema = z
  .string()
  .max(500, { message: "Maelezo ni marefu sana (max 500) / Description is too long (max 500)" })
  .transform((val) => sanitize.full(val))
  .optional();

// WhatsApp schema (optional, Tanzanian format)
export const whatsappSchema = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    let phone = val.replace(/\s+/g, "").replace(/-/g, "");
    if (phone.startsWith("0")) {
      phone = "+255" + phone.slice(1);
    }
    if (phone.startsWith("255")) {
      phone = "+" + phone;
    }
    return phone;
  })
  .refine((val) => !val || TANZANIAN_PHONE_REGEX.test(val), {
    message: "Nambari ya WhatsApp si sahihi / Invalid WhatsApp number",
  });

// Specialty schema for fundis
export const specialtySchema = z
  .array(z.string().min(2).max(50).transform((val) => sanitize.full(val)))
  .min(1, { message: "Chagua angalau utaalamu mmoja / Select at least one specialty" })
  .max(10, { message: "Utaalamu ni wengi sana (max 10) / Too many specialties (max 10)" });

// Shop categories schema
export const shopCategoriesSchema = z
  .array(z.string().min(2).max(50).transform((val) => sanitize.full(val)))
  .min(1, { message: "Chagua angalau kategoria moja / Select at least one category" })
  .max(10, { message: "Kategoria ni nyingi sana (max 10) / Too many categories (max 10)" });

// Opening hours schema
export const openingHoursSchema = z.object({
  monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
  tuesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
  wednesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
  thursday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
  friday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
  saturday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
  sunday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
}).optional();

// =====================================================
// REGISTRATION SCHEMAS
// =====================================================

// Base registration fields (without refine - allows extend)
const baseRegistrationFields = {
  full_name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  password: passwordSchema,
  city: citySchema,
  ward: z.string().min(2).max(100).transform((val) => sanitize.full(val)).optional(),
};

// Customer registration schema
export const customerRegistrationSchema = z.object({
  ...baseRegistrationFields,
  role: z.literal("customer"),
}).refine((data) => data.email || data.phone, {
  message: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone number",
  path: ["email"],
});

// Fundi registration schema
export const fundiRegistrationSchema = z.object({
  ...baseRegistrationFields,
  role: z.literal("fundi"),
  specialty: specialtySchema,
  bio: bioSchema,
  whatsapp: whatsappSchema,
  national_id: nationalIdSchema.optional(),
}).refine((data) => data.email || data.phone, {
  message: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone number",
  path: ["email"],
});

// Shop registration schema
export const shopRegistrationSchema = z.object({
  ...baseRegistrationFields,
  role: z.literal("shop"),
  shop_name: z.string().min(2).max(100).transform((val) => sanitize.full(val)),
  shop_categories: shopCategoriesSchema,
  opening_hours: openingHoursSchema,
  whatsapp: whatsappSchema,
}).refine((data) => data.email || data.phone, {
  message: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone number",
  path: ["email"],
});

// Combined registration schema
export const registrationSchema = z.discriminatedUnion("role", [
  z.object({
    ...baseRegistrationFields,
    role: z.literal("customer"),
  }),
  z.object({
    ...baseRegistrationFields,
    role: z.literal("fundi"),
    specialty: specialtySchema,
    bio: bioSchema,
    whatsapp: whatsappSchema,
    national_id: nationalIdSchema.optional(),
  }),
  z.object({
    ...baseRegistrationFields,
    role: z.literal("shop"),
    shop_name: z.string().min(2).max(100).transform((val) => sanitize.full(val)),
    shop_categories: shopCategoriesSchema,
    opening_hours: openingHoursSchema,
    whatsapp: whatsappSchema,
  }),
]).refine((data) => data.email || data.phone, {
  message: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone number",
  path: ["email"],
});

// =====================================================
// LOGIN SCHEMA
// =====================================================

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Lazima utoe barua pepe au nambari ya simu / Must provide email or phone" }),
  password: z.string().min(1, { message: "Nenosiri linahitajika / Password is required" }),
  remember_me: z.boolean().optional().default(false),
});

// =====================================================
// PASSWORD RESET SCHEMA
// =====================================================

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetSchema = z.object({
  token: z.string().min(1),
  new_password: passwordSchema,
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Nenosiri hazifanani / Passwords do not match",
  path: ["confirm_password"],
});

// =====================================================
// SEARCH SCHEMA
// =====================================================

export const searchSchema = z.object({
  query: z.string().max(100).transform((val) => sanitize.full(val)).optional(),
  role: z.enum(["fundi", "shop"]).optional(),
  city: citySchema.optional(),
  specialty: z.string().max(50).transform((val) => sanitize.full(val)).optional(),
  category: z.string().max(50).transform((val) => sanitize.full(val)).optional(),
  page: z.number().int().positive().max(1000).optional().default(1),
  limit: z.number().int().positive().max(50).optional().default(20),
});

// =====================================================
// PAYMENT SCHEMA
// =====================================================

export const mpesaPaymentSchema = z.object({
  phone: phoneSchema,
  amount: amountSchema,
  reference: z.string().min(1).max(50).transform((val) => sanitize.full(val)),
  description: z.string().max(200).transform((val) => sanitize.full(val)).optional(),
});

// =====================================================
// MESSAGE SCHEMA
// =====================================================

export const messageSchema = z.object({
  recipient_id: z.string().uuid({ message: "ID ya mpokeaji si sahihi / Invalid recipient ID" }),
  content: z
    .string()
    .min(1, { message: "Ujumbe hauwezi kuwa tupu / Message cannot be empty" })
    .max(2000, { message: "Ujumbe ni mrefu sana (max 2000) / Message is too long (max 2000)" })
    .transform((val) => sanitize.full(val)),
});

// =====================================================
// REVIEW SCHEMA
// =====================================================

export const reviewSchema = z.object({
  target_id: z.string().uuid({ message: "ID si sahihi / Invalid ID" }),
  rating: z.number().int().min(1).max(5, { message: "Daraja lazima liwe kati ya 1 na 5 / Rating must be between 1 and 5" }),
  comment: z.string().max(500).transform((val) => sanitize.full(val)).optional(),
});

// =====================================================
// PROFILE UPDATE SCHEMA
// =====================================================

export const profileUpdateSchema = z.object({
  full_name: nameSchema.optional(),
  bio: bioSchema,
  city: citySchema.optional(),
  ward: z.string().min(2).max(100).transform((val) => sanitize.full(val)).optional(),
  whatsapp: whatsappSchema,
  avatar_url: z.string().url().optional(),
  specialty: specialtySchema.optional(),
  shop_name: z.string().min(2).max(100).transform((val) => sanitize.full(val)).optional(),
  shop_categories: shopCategoriesSchema.optional(),
  opening_hours: openingHoursSchema,
});

// =====================================================
// TYPE EXPORTS
// =====================================================

export type CustomerRegistration = z.infer<typeof customerRegistrationSchema>;
export type FundiRegistration = z.infer<typeof fundiRegistrationSchema>;
export type ShopRegistration = z.infer<typeof shopRegistrationSchema>;
export type Registration = z.infer<typeof registrationSchema>;
export type Login = z.infer<typeof loginSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type Search = z.infer<typeof searchSchema>;
export type MpesaPayment = z.infer<typeof mpesaPaymentSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;