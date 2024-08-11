import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface FormErrorProps {
	message?: string
}

export function FormError({message}: FormErrorProps) {
	if (!message)
		return null;

	return (
		<div>
			<ExclamationTriangleIcon />
			<p>{message}</p>
		</div>
	)
}