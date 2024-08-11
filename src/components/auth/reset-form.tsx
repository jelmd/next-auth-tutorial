'use client';

import { useForm } from "react-hook-form";
import { CardWrapper } from "./card-wraper";
import * as z from 'zod';
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";

export function ResetForm() {
	const [error, setErrror] = useState<string|undefined>('');
	const [success, setSuccess] = useState<string|undefined>('');
	const [isPending, startTransition] = useTransition();

	const aForm = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: ''
		}
	});
	
	function onSubmit(values: z.infer<typeof ResetSchema>) {
		startTransition(() => {
			reset(values).then((data) => {
				if (data) {
					setSuccess(data.success);
					setErrror(data.error);
				}
			});
		});
	}

	return (
		<CardWrapper headerLabel="Forgot your password?"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login">
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
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button type="submit">Send reset email</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}