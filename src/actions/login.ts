'use server';

import { signIn } from "@/auth"
import { getFactorTwoIdByUserId } from "@/data/two-factor-map"
import { getFactorTwoTokenByEmail, getFactorTwoTokenByToken } from "@/data/two-factor-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { sendFactorTwoEmail, sendVerifyEmail } from "@/lib/mail"
import { genFactorTwoToken, genVerifyToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export async function login (values: z.infer<typeof LoginSchema>) {
	const validatedFields = LoginSchema.safeParse(values);

	console.log({validatedFields: validatedFields});
	if (!validatedFields.success)
		return { error: 'Invalid fields' };

	const { email, password, code } = validatedFields.data;
	const user = await getUserByEmail(email);
	if (!user || !user.email || !user.password)
		return { error: 'Invalid credentials!'};

	try {
		if (!user.emailVerified) {
			const entry = await genVerifyToken(user.email);
			await sendVerifyEmail(user.email, entry.token)
			return entry
				? { success: 'Confirmation email sent!'}
				: { error: 'Failed to generate confirmation token.'};
		}
		if (user.use2FA && user.email) {
			if (code) {
				const err = await getFactorTwoTokenByEmail(user.email).then(entry => {
					console.log({ entry: entry, code: code });
					if (!entry || entry.token !== code)
						return { error: 'Invalid code!'}
					if (entry.expires.getTime() < Date.now())
						return { error: 'Code expired!'}
					return db.factorTwoToken.delete({
						where: { id: entry.id }
					}).then(() => {
						return getFactorTwoIdByUserId(user.id).then(e => {
							return (e)
								? db.factorTwo2User.delete({ where: { id: e.id } })
								: null;
						}).then(() => {
							return db.factorTwo2User.create({
								data: { userId: user.id }
							})
						}).then(() => null)
					})
				});
				if (err)
					return err;
			} else {
				return genFactorTwoToken(user.email).then(token => 
					sendFactorTwoEmail(token.email, token.token))
					.then(() => { return { twoFactor: true } });
			}
		}
		const ok = await signIn('credentials', {
			email, password, redirectTo: DEFAULT_LOGIN_REDIRECT
		});
		console.log({OK: ok});
		return ok ? { success: 'ok' } : { error: 'Failed!'};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid credentials.' };
				default:
					return { error: 'Something went wrong.' };
			}
		}
		throw error;
	}
}