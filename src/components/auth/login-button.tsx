"use client"

import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { LoginForm } from "./login-form"

interface LoginButtonProps {
	children: ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean
}

export function LoginButton({ children, mode = 'redirect', asChild }:
	LoginButtonProps)
{
	const router = useRouter();
	const DEBUG = 0;

	function onClick(e: any) {
		if (DEBUG) console.log('LoginButton', e);
		router.push('/auth/login');
	}

	if (mode === 'modal') {
		return (
			<Dialog>
				<DialogTrigger asChild={asChild}>
					{children}
				</DialogTrigger>
				<DialogContent>
					<DialogTitle />
					<LoginForm />
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<span onClick={onClick} className="cursor-pointer">{children}</span>
	)
}