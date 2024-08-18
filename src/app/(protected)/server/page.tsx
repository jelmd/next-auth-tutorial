import { UserInfoPage } from "@/components/user-info"
import { currentUser } from "@/lib/auth"

export default async function ServerPage() {
	const user = await currentUser();

	return (
		<UserInfoPage label="Server component" user={user}/>
	)
}