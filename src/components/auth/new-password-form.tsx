'use client';

import { useForm } from "react-hook-form";
import { CardWrapper } from "./card-wraper";
import * as z from 'zod';
import { PasswordSchema} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { verify } from "@/actions/verify"

export function NewPasswordForm() {
	const [error, setErrror] = useState<string|undefined>('');
	const [success, setSuccess] = useState<string|undefined>('');
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const aForm = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			password: ''
		}
	});
	
	function onSubmit(values: z.infer<typeof PasswordSchema>) {
		startTransition(() => {
			verify(token, values).then((data) => {
				if (data) {
					setSuccess(data.success);
					setErrror(data.error);
				}
			});
		});
	}

	return (
		<CardWrapper headerLabel="Enter a new password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login">
			<Form {...aForm}>
				<form onSubmit={aForm.handleSubmit(onSubmit)}>
					<div>
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
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button type="submit">Reset password</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}