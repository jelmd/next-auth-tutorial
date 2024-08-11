"use client"

import { useRouter } from "next/navigation"
import { ReactNode } from "react"

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
		return <span>TODO: implement modal</span>
	}

	return (
		<span onClick={ onClick }>{ children }</span>
	)
}