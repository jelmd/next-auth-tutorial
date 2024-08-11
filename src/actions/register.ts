'use server';

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { genVerifyToken } from "@/lib/tokens"
import { sendVerifyEmail } from "@/lib/mail"

export async function register (values: z.infer<typeof RegisterSchema>) {
	const validatedFields = RegisterSchema.safeParse(values);
	if (!validatedFields.success)
		return { error: 'Invalid fields' };

	const { email, password, name } = validatedFields.data!;
	const hashedPassword = await bcrypt.hashSync(password, 10);
	const existingUser = await getUserByEmail(email);

	if (existingUser)
		return { error: "Email already taken" };

	await db.user.create({
		data: { name, email, password: hashedPassword }
	})
	const entry = await genVerifyToken(email);
	if (entry)
		await sendVerifyEmail(entry.email, entry.token)
	return entry
		? { success: 'Confirmation email sent!' }
		: { error: 'Token generation failed!' };
}