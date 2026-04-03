import { z } from 'zod';
import { Role, UserStatus, RecordType } from '@prisma/client';

// ─── Auth ─────────────────────────────────────────────────────

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// ─── Users ────────────────────────────────────────────────────

export const updateRoleSchema = z.object({
    role: z.nativeEnum(Role, {
        errorMap: () => ({ message: `Role must be one of: ${Object.values(Role).join(', ')}` }),
    }),
});

export const updateStatusSchema = z.object({
    status: z.nativeEnum(UserStatus, {
        errorMap: () => ({
            message: `Status must be one of: ${Object.values(UserStatus).join(', ')}`,
        }),
    }),
});

// ─── Records ──────────────────────────────────────────────────

export const createRecordSchema = z.object({
    amount: z
        .number({ invalid_type_error: 'Amount must be a number' })
        .positive('Amount must be positive')
        .multipleOf(0.01, 'Amount can have at most 2 decimal places'),
    type: z.nativeEnum(RecordType, {
        errorMap: () => ({
            message: `Type must be one of: ${Object.values(RecordType).join(', ')}`,
        }),
    }),
    category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Date must be a valid ISO 8601 date string',
    }),
    notes: z.string().max(500, 'Notes too long').optional(),
    userId: z.string().cuid('Invalid user ID'),
});

export const updateRecordSchema = createRecordSchema.partial().omit({ userId: true });

export const recordQuerySchema = z.object({
    type: z.nativeEnum(RecordType).optional(),
    category: z.string().optional(),
    from: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid from date' }),
    to: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid to date' }),
    page: z
        .string()
        .default('1')
        .transform(Number)
        .refine((val) => val > 0, { message: 'Page must be > 0' }),
    limit: z
        .string()
        .default('10')
        .transform(Number)
        .refine((val) => val > 0 && val <= 100, { message: 'Limit must be between 1 and 100' }),
});

// ─── ID param ─────────────────────────────────────────────────

export const idParamSchema = z.object({
    id: z.string().cuid('Invalid ID format'),
});

// ─── Exported types ───────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordQueryInput = z.infer<typeof recordQuerySchema>;
