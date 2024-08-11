'use server';

import { getUserByEmail } from "@/data/user"
import { sendVerifyEmail } from "@/lib/mail"
import { genVerifyToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export async function reset(values: z.infer<typeof ResetSchema>) {
	const validatedFields = ResetSchema.safeParse(values);

	console.log({validatedFields: validatedFields});
	if (!validatedFields.success)
		return { error: 'Invalid email' };

	const { email } = validatedFields.data;
	const user = await getUserByEmail(email);
	if (!user || !user.email)
		return { error: 'Email not found.'};

	try {
		const entry = await genVerifyToken(user.email);
		await sendVerifyEmail(user.email, entry.token, true);
		return entry
			? { success: 'Reset email sent!'}
			: { error: 'Failed to generate reset token.'};
	} catch (error) {
		return { error: 'Something went wrong.' };
	}
}