'use client';

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

export default function AdminPage() {
	function onApiClick() {
		fetch('/api/admin').then(response => {
			if (response.ok)
				toast.success('OKAY')
			else
				toast.error('FORBIDDEN')
		})
	}

	function onServerClick() {
		admin().then((data) => {
			if (data.error)
				toast.error(data.error)
			else if (data.success)
				toast.success(data.success)
		})
	}

	return (
		<Card>
			<CardHeader><p>Admin</p></CardHeader>
			<CardContent>
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message="You are allwed to see this page."/>
				</RoleGate>
				<div>
					<p>Admin only API route</p>
					<Button onClick={onApiClick}>Click to test</Button>
				</div>
				<div>
					<p>Admin only server action</p>
					<Button onClick={onServerClick}>Click to test</Button>
				</div>
			</CardContent>
		</Card>
	)
}