import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Required"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email").min(1, "Required"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    location: z.string().min(2, "Location is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Provider validation schemas
export const providerLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export const providerRegisterSchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    location: z.string().min(2, "Location is required"),
    availability: z.array(z.string()).min(1, "Select at least one day"),
    yearEstablished: z.string().regex(/^\d{4}$/, "Enter a valid year"),
    paymentMethods: z
      .array(z.string())
      .min(1, "Select at least one payment method"),
    serviceAreas: z
      .array(z.string())
      .min(1, "Select at least one service area"),
    totalWorkers: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(1, "Must be at least 1 worker"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Admin validation schemas
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
