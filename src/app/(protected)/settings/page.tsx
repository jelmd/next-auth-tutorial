/**  SSR variante */
/*
import { auth, signOut } from "@/auth"

export default async function SettingsPage() {
	const session = await auth();
	return (
		<div>
			<p>{JSON.stringify(session)}</p>
			<form action={async () => {
				'use server';
				await signOut({ redirectTo: '/' });
			}}>
				<button type="submit">Sign out</button>
			</form>
		</div>
	)
}
*/

/** CSR variante does not work with next-auth v5-beta.20 */
/*
'use client'

import { logout } from "@/actions/logout"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function SettingsPage() {
	const user = useCurrentUser();

	function onClick()  {
		logout();
	}
	return (
		<div>
			<p>{JSON.stringify(user)}</p>
			<form>
				<button type="submit" onClick={onClick}>Sign out</button>
			</form>
		</div>
	)
}
*/

// the final variant
'use client'

import { settings } from "@/actions/settings"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCurrentUser } from "@/hooks/use-current-user"
import { SettingsSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserRole } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export default function SettingsPage() {
	const [isPending, startTransition] = useTransition()
	const { update } = useSession()
	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()
	const user = useCurrentUser()

	// use undefined for defaultValues to not update the fields,
	// which have not been changed
	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			role: user?.role || undefined,
			use2FA: user?.use2FA || undefined,
			password: undefined,		// we do not have the plain text password
			newPassword: undefined		// we do not have the plain text password
			//image: user?.image || undefined,
		}
	})

	function onSubmit(values: z.infer<typeof SettingsSchema>) {
		startTransition(() => {
			settings(values).then((data) => {
				if (data.error) {
					setError(data.error)
				}
				if (data.success) {
					update()
					setSuccess(data.success)
				}
			}).catch(e => {
				console.log(e)
				setError('Unexpecte error.')
			})
		})
	}

	return (
		<Card>
			<CardHeader><p>Settings</p></CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div>
							<FormField control={form.control} name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="John Doe"
												disabled={isPending} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
								<>
									<FormField control={form.control} name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...field} placeholder="john.doe@example.com"
														type="email" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField control={form.control} name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input {...field} placeholder="******"
														type="password" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField control={form.control} name="newPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input {...field} placeholder="******"
														type="password" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField control={form.control} name="use2FA"
										render={({ field }) => (
											<FormItem>
												<div>
													<FormLabel>2FA</FormLabel>
													<FormDescription>Enale two factor authentication</FormDescription>
												</div>
												<FormControl>
													<Switch checked={field.value}
														onChange={field.onChange}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							<FormField control={form.control} name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select defaultValue={field.value}
											onValueChange={field.onChange}
											disabled={isPending}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a role' />											</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
												<SelectItem value={UserRole.USER}>User</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button type="submit">Save</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}