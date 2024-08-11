import { getVerifyTokenByEmail } from "@/data/verify-token"
import { v1 as uuid4 } from "uuid"
import { db } from "./db";
import { getFactorTwoTokenByEmail } from "@/data/two-factor-token"

export async function genVerifyToken(email: string) {
	const token = uuid4();
	const expires = new Date(Date.now() + 3600 * 1000);
	const existingToken = await getVerifyTokenByEmail(email);

	if (existingToken) {
		await db.verifyToken.delete({
			where: { id: existingToken.id }
		});
	}
	const t = await db.verifyToken.create({
		data: {
			email, token, expires
		}
	});
	return t;
}

export async function genFactorTwoToken(email: string) {
	const array = new Uint32Array(1);
	const token = crypto.getRandomValues(array)[0].toString();
	// TBD: change to 15 min
	const expires = new Date(Date.now() + 300 * 1000);

	return getFactorTwoTokenByEmail(email).then(oldToken => {
		return oldToken
			? db.factorTwoToken.delete({ where: { id: oldToken.id } })
			: null;
	}).then(() => db.factorTwoToken.create({
		data: {
			email, token, expires
		}
	}));

}