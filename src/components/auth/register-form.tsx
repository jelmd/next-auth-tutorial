'use client';

import { useForm } from "react-hook-form";
import { CardWrapper } from "./card-wraper";
import * as z from 'zod';
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { register } from "@/actions/register";
import { useState, useTransition } from "react";

export function RegisterForm() {
	const [error, setErrror] = useState<string|undefined>('');
	const [success, setSuccess] = useState<string|undefined>('');
	const [isPending, startTransition] = useTransition();

	const aForm = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: ''
		}
	});
	
	function onSubmit(values: z.infer<typeof RegisterSchema>) {
		startTransition(() => {
			register(values).then((data) => {
				setSuccess(data.success);
				setErrror(data.error);
			});
		});
	}

	return (
		<CardWrapper headerLabel="Create an account"
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial>
			<Form {...aForm}>
				<form onSubmit={aForm.handleSubmit(onSubmit)}>
					<div>
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField control={aForm.control} name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending}
											placeholder="John Doe"
											type="text" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button type="submit">Register</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}