import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode}) {
	return (
		<>
		<nav className="bg-sky-500 text-white">Navbar</nav>
		<div>{ children }</div>
		</>
	)
}