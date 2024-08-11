import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerifyEmail(email: string, token: string, pwReset = false) {
	const link = pwReset
		? `http://localhost:3000/auth/new-password?token=${token}`
		: `http://localhost:3000/auth/new-verify?token=${token}`;
	return resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: pwReset ? 'Reset your password' : 'Confirm your email',
		text: `Please click ${link} to `
			+ (pwReset ? 'reset your password.' : ' confirm your email')
	});
}

export async function sendFactorTwoEmail(email: string, token: string) {
	return resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: '2FA code',
		text: `Your 2FA code: ${ token }`
	});
}