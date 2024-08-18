'use client';

import { UserInfoPage } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function ClientPage() {
	const user = useCurrentUser();

	return (
		<UserInfoPage label="Client component" user={user}/>
	)
}