import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./card-wraper";

export function ErrorCard() {
	return (
		<CardWrapper headerLabel="Ooops, something went wrong!"
			backButtonLabel="Back to login" backButtonHref="/auth/login">
			<div>
				<ExclamationTriangleIcon />
			</div>
		</CardWrapper>
	);
}