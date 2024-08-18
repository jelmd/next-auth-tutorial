import { currentUser } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET() {
	return currentUser().then(user =>
		new NextResponse(null, { status: user?.role == UserRole.ADMIN ? 200 : 403 })
	)
}