'use server';

import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendVerifyEmail } from '@/lib/mail'
import { genVerifyToken } from '@/lib/tokens'
import { Result } from '@/lib/utils'
import { SettingsSchema } from '@/schemas'
import { compareSync, hashSync } from 'bcryptjs'
import * as z from 'zod';

export async function settings(values: z.infer<typeof SettingsSchema>): Promise<Result> {
	const sUser = await currentUser();
	if (!sUser)
		return { error: 'No session.' };

	// just make sure that the user is still in the db
	return getUserById(sUser.id as string).then(user => {
		if (!user)
			return { error: 'User not found.' }

		// make sure all props not available in the db or should not be updated
		// need to be set to  undefined.
		if (sUser.isOAuth) {
			values.email = undefined;
			values.password = undefined;
			values.newPassword = undefined;
			values.use2FA = undefined;
		}
		if (values.email && user.email !== values.email) {
			return getUserByEmail(values.email).then(u => {
				return (u && u.id === user.id)
					? null
					: genVerifyToken(values.email!)
			}).then(token => {
				return token ? sendVerifyEmail(token.email, token.email) : null;
			}).then(res => {
				if (res == null)
					return { error: 'Email address already in use.'}
				if (res.error)
					return { error: res.error.message }
				return { success: 'Verification email sent!'}
			});
		}

		if (values.password && values.newPassword && user.password) {
			if (values.password && values.newPassword) {
				values.password = undefined;
				values.newPassword = undefined;
			} else if (!compareSync(values.password, user.password)) {
				return { error: 'Incorrect password.'}
			} else {
				values.password = hashSync(values.password, 10);
				values.newPassword = undefined;
			}
		}

		return db.user.update({
				where: { id: user.id },
				data: { ...values }
			}).then(res => {
				return res ? { success: 'Settings updated!'} : { error: 'Unauthorized!' }
			});
	});

}