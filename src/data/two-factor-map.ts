import { db } from "@/lib/db"

export async function getFactorTwoIdByUserId(userId: string) {
	try {
		const t = await db.factorTwo2User.findUnique({
			where: { userId }
		});
		return t;
	} catch (error) {
		console.log(error);
		return null;
	}
}