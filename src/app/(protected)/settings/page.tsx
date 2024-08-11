/**  SSR variante 
import { auth, signOut } from "@/auth"

export default async function SettingsPage() {
	const session = await auth();
	return (
		<div>
			<p>{JSON.stringify(session)}</p>
			<form action={async () => {
				'use server';
				await signOut();
			}}>
				<button type="submit">Sign out</button>
			</form>
		</div>
	)
}
*/

/** CSR variante */
'use client'

import { logout } from "@/actions/logout"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
	const session = useSession();

	function onClick()  {
		logout();
	}
	return (
		<div>
			<p>{JSON.stringify(session)}</p>
			<form>
				<button type="submit" onClick={onClick}>Sign out</button>
			</form>
		</div>
	)
}