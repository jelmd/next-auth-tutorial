interface HeaderProps {
	label: string;
}

export function Header({ label }: HeaderProps) {
	return (
		<div>
			<h1>Auth</h1>
			<p>{ label }</p>
		</div>
	)
}