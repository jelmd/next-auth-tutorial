'use client';

import { useForm } from "react-hook-form";
import { CardWrapper } from "./card-wraper";
import * as z from 'zod';
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login } from "@/actions/login"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export function LoginForm() {
	const [error, setErrror] = useState<string|undefined>('');
	const [success, setSuccess] = useState<string|undefined>('');
	const [isPending, startTransition] = useTransition();
	const [show2FA, setShow2FA] = useState(false);
	const searchParams = useSearchParams();
	const err = searchParams.get('error');
	const urlError = (err === 'OAuthAccountNotLinkedError')
	 ? 'Email is used with another provider!'
	 : (err === null) ? '' : err;
	const cbUrl = searchParams.get('callbackUrl');

	const aForm = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});
	
	function onSubmit(values: z.infer<typeof LoginSchema>) {
		startTransition(async () => {
			return login(values, cbUrl).then((data) => {
				if (data?.error) {
					aForm.reset();
					setErrror(data.error);
				} else if (data?.success) {
					aForm.reset();
					setSuccess(data.success);
				}
				if (data?.twoFactor) {
					setShow2FA(true);
				}
			}).catch((e) => {
				setErrror('Something went wrong: ' + e);
			});
		});
	}

	return (
		<CardWrapper headerLabel="Welcome back!"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial>
			<Form {...aForm}>
				<form onSubmit={aForm.handleSubmit(onSubmit)}>
					<div>
						{ show2FA && (<>
							<FormField control={aForm.control} name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>
										<FormControl>
											<Input {...field} disabled={isPending}
												placeholder="123456"
												type="number" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>)}
						{ !show2FA && (<>
							<FormField control={aForm.control} name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} disabled={isPending}
												placeholder="john.doe@example.com"
												type="email" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField control={aForm.control} name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input {...field} disabled={isPending}
												placeholder="******"
												type="password" />
										</FormControl>
										<Button size='sm' variant='link' asChild>
											<Link href='/auth/reset'>Forgot password?</Link>
										</Button>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button type="submit">{show2FA ? 'Confirm' : 'Login'}</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}