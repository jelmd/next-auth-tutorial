import { auth } from "@/auth"

export async function currentUser() {
	return auth().then(session => session?.user);
}

export async function currentRole() {
	return auth().then(session => session?.user.role);
}