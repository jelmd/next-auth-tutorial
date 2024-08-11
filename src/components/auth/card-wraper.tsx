'use client';

import { ReactNode } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Header } from "@/components/auth/header"
import { Social } from "./social"
import { BackButton } from "./back-button"

interface CardWrapperProps {
	children: ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean
};

export function CardWrapper({ children, headerLabel, backButtonLabel,
	backButtonHref, showSocial }: CardWrapperProps)
{
	return (
		<Card>
			<CardHeader>
				<Header label={headerLabel}/>
			</CardHeader>
			<CardContent>
				{ children }
			</CardContent>
			{
				showSocial && (
					<CardFooter>
						<Social />
					</CardFooter>
				)
			}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	)
}
