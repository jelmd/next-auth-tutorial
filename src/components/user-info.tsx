import { ExtendedUser } from "@/auth";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from "./ui/badge"

interface UserInfoProps {
	user?: ExtendedUser;
	label?: string
}

export function UserInfoPage({user, label}: UserInfoProps) {
	return (
		<Card>
			<CardHeader><p>{label}</p></CardHeader>
			<CardContent>
				<div>
					<p>ID</p><p>{user?.id}</p>
					<p>Name</p><p>{user?.name}</p>
					<p>Email</p><p>{user?.email}</p>
					<p>Role</p><p>{user?.role}</p>
					<p>2FA</p>
					<Badge variant={user?.use2FA ? 'default' : 'destructive'}>
						{user?.use2FA ? 'On' : 'Off'}
					</Badge>
				</div>
			</CardContent>
		</Card>
	)
}