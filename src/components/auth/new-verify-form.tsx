'use client';

import { BeatLoader } from "react-spinners"
import { CardWrapper } from "./card-wraper"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { verify } from "@/actions/verify"
import { FormSuccess } from "../form-success"
import { FormError } from "../form-error"

export function NewVerifyForm() {
	const [error, setErrror] = useState<string|undefined>();
	const [success, setSuccess] = useState<string|undefined>();
	const params = useSearchParams();
	const token = params.get('token');
	const onSubmit = useCallback(() => {
		if (!token) {
			setErrror('Missing token.');
			return;
		}
		verify(token).then(data => {
			setErrror(data?.error);
			setSuccess(data?.success);
		}).catch(()=>{
			setErrror('something went wrong');
		})
		console.log(token);
	}, [token]);
	useEffect(() => {
		onSubmit();
	}, [onSubmit]);
	return (
		<CardWrapper headerLabel="Confirming your verification"
			backButtonLabel="Back to Login"
			backButtonHref="/auth/login">
				<div>
					{ !success && !error && ( <BeatLoader /> )}
					<FormSuccess message={success} />
					<FormError message={error} />
				</div>
		</CardWrapper>
	)
}