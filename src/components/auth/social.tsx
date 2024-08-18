'use client';

import { FcGoogle } from "react-icons/fc"; 
import { FaGithub } from "react-icons/fa"; 

import { Button } from "../ui/button";
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { useSearchParams } from "next/navigation"

export function Social() {
	const searchParams = useSearchParams();
	const cbUrl = searchParams.get('callbackUrl');

	function onClick(provider: 'google' | 'github') {
		signIn(provider, {
			callbackUrl: cbUrl || DEFAULT_LOGIN_REDIRECT
		});
	}

	return (
		<div>
			<Button size='lg' variant='outline' onClick={() => onClick('github')}>
				<FaGithub />
			</Button>
			<Button size='lg' variant='outline' onClick={() => onClick('google')}>
				<FcGoogle />
			</Button>
		</div>
	)
}