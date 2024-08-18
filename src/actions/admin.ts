'use server';

import { currentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export async function admin() {
	return currentRole().then(role => 
		role === UserRole.ADMIN ? { success: 'Allowed!'} : { error: 'Forbidden!'}
	)
}