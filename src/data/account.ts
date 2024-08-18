import { db } from "@/lib/db"

export async function getAccountByUserId(id: string) {
	try {
		return db.account.findFirst({
			where: { userId: id }
		});
	} catch (e) {
		console.log(e);
		return null;
	}
}