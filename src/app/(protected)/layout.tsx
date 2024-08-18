import { ReactNode } from "react"
import { Navbar } from "./_components/navbar"

interface ProtectedLayoutProps {
	children: ReactNode
}

export default function ProtectedLayout({children}: ProtectedLayoutProps) {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	)
} 