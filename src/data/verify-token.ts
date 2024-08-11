import { db } from "@/lib/db"

export async function getVerifyTokenByEmail(email: string) {
	try {
		const t = await db.verifyToken.findFirst({
			where: { email }
		});
		return t;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function getVerifyTokenByToken(token: string) {
	try {
		const t = await db.verifyToken.findUnique({
			where: { token }
		});
		return t;
	} catch (error) {
		console.log(error);
		return null;
	}
}