import { UserRole } from "@prisma/client"
import * as z from "zod";

export const LoginSchema = z.object({
	email: z.string().email({ message: 'Email required'}),
	password: z.string().min(1, { message: 'Password required'}),
	code: z.optional(z.string())
});

export const RegisterSchema = z.object({
	email: z.string().email({ message: 'Email required'}),
	password: z.string().min(6, { message: 'Min. 6 chars required'}),
	name: z.string().min(1, { message: 'Name required' })
});

export const ResetSchema = z.object({
	email: z.string().email({ message: 'Email required'})
});

export const PasswordSchema = z.object({
	password: z.string().min(6, { message: 'Min. 6 chars required'})
});

export const SettingsSchema = z.object({
	name: z.optional(z.string()),
	use2FA: z.optional(z.boolean()),
	role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
	email: z.optional(z.string().email()),
	password: z.optional(z.string().min(6)),
	newPassword: z.optional(z.string().min(6)),
}).refine(data => {
	return (data.password && !data.newPassword) ? false : true;
}, {
	message: 'New password required',
	path: ['newpassword']
}).refine(data => {
	return (!data.password && data.newPassword) ? false : true;
}, {
	message: 'Password required',
	path: ['password']
});