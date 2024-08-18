'use client';

import { Role } from "@/auth"
import { useCurrentRole } from "@/hooks/use-current-role"
import { ReactNode } from "react"
import { FormError } from "../form-error"

interface RoleGateProps {
	children: ReactNode;
	allowedRole: Role;
}
export function RoleGate({children, allowedRole}: RoleGateProps) {
	const role = useCurrentRole();

	if (role != allowedRole) {
		return (
			<FormError message="You are not allowed to view this page!" />
		)
	}

	return (
		<>{children}</>
	)
}