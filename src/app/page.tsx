"use client"
import { LoginButton } from "@/components/auth/login-button"
import { Button } from "@/components/ui/button"

export default function Home() {
	return (
		<main>
			<div>
				<h1>Auth</h1>
				<p>simple auth service</p>
				<LoginButton>
					<Button size='lg' variant='secondary'>SignIn</Button>
				</LoginButton>
			</div>
		</main>
	)
}
