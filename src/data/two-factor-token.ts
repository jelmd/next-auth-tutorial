import { db } from "@/lib/db"

export async function getFactorTwoTokenByEmail(email: string) {
	try {
		const t = await db.factorTwoToken.findFirst({
			where: { email }
		});
		return t;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function getFactorTwoTokenByToken(token: string) {
	try {
		const t = await db.factorTwoToken.findUnique({
			where: { token }
		});
		return t;
	} catch (error) {
		console.log(error);
		return null;
	}
}