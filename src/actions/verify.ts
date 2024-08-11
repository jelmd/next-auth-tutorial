'use server';

import * as z from 'zod';
import bcrypt from "bcryptjs";

import { getUserByEmail } from "@/data/user"
import { getVerifyTokenByToken } from "@/data/verify-token";
import { db } from "@/lib/db"
import { PasswordSchema } from "@/schemas"

export async function verify(token: string|null, values?: z.infer<typeof PasswordSchema>) {
	var pwHash = '';

	if (!token)
		return { error: 'Missing token.'};

	if (values) {
		const validatedFields = PasswordSchema.safeParse(values);
		if (validatedFields.success) {
			const { password } = validatedFields.data;
			pwHash = password;
		} else {
			return { error: 'Invalid fields' };
		}
	}

	const entry = await getVerifyTokenByToken(token);
	if (!entry)
		return { error: 'Token not found.'};

	const expired = entry.expires.getTime() < Date.now();
	if (expired)
		return { error: 'Token expired.'};
	
	const user = await getUserByEmail(entry.email);
	if (!user)
		return { error: 'Email does not exist.'};

	if (pwHash)
		pwHash = bcrypt.hashSync(pwHash);

	return db.user.update({
		where: { id: user.id },
		data: pwHash
			? { password: pwHash }
			: {
				emailVerified: new Date(),
				email: entry.email
			}
	}).then(u => {
		return u
			? db.verifyToken.delete({ where: { id: entry.id }}).then(() => u)
			: null
	}).then(val => {
		return val
			? { success: pwHash ? 'Password updated' : 'Email verified!'}
			: { error: 'DB update failed!' };
	});
}