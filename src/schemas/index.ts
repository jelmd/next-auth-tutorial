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
