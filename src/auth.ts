import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserByEmail, getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getFactorTwoIdByUserId } from "./data/two-factor-map"
import { getAccountByUserId } from "./data/account"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import bcrypt from "bcryptjs";

export type Role = UserRole;
/* this */
// export interface ExtendedUser extends User {
// 	role: Role;
// 	use2FA: boolean
// }

/* or that */
export type ExtendedUser = DefaultSession['user'] & {
	role: Role;
	use2FA: boolean;
	isOAuth: boolean;
}

declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}

declare module "@auth/core/jwt" {
	interface JWT extends DefaultJWT {
		role?: Role;
		use2FA: boolean;
		isOAuth: boolean;
	}
}

// make sure, env var AUTH_SECRET is set!
export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error'
	},
	callbacks: {
		async signIn({user, account, profile, email, credentials}) {
			if (account?.provider !== 'credentials') {
				console.log({callback: 'signIn', user, account, profile, email, credentials});
				return true;
			}

			const existingUser = await getUserById(user.id!);
			if (!existingUser || !existingUser.emailVerified)
				return false;

			console.log({callback: 'signIn', user, account, profile, email, credentials, dbUser: existingUser });
			if (existingUser?.use2FA) {
				const fid = await getFactorTwoIdByUserId(existingUser.id);
				if (!fid)
					return false;

				db.factorTwo2User.delete({
					where: { id: fid.id }
				});
			}
			return true;
		},
		async jwt({token, user, account, profile, trigger, session}) {
			if (token.sub) {
				const existingUser = await getUserById(token.sub);
				if (existingUser) {
					const existingAccount = await getAccountByUserId(existingUser.id);
					// also needed to update session values because its values
					// get used to generate html pages
					token.isOAuth = !!existingAccount;
					token.role = existingUser.role;
					token.use2FA = existingUser.use2FA;
					token.name = existingUser.name;
					token.email = existingUser.email;
					token.picture = existingUser.image;
				}
			}
			console.log({callback: 'jwt', token, user, account, profile, trigger, session});
			return token;
		},
		async session({ session, user, token, newSession, trigger}) {
			if (session.user) {
				// need to update only the non-default properties here
				if (token.sub)
					session.user.id = token.sub;
				if (token['role'])
					session.user.role = token.role;
				session.user.email = token.email as string;
				session.user.name = token.name;
				session.user.isOAuth = token.isOAuth;
				session.user.use2FA = token.use2FA;
			}
			console.log({ callback: 'session', session, user, token, newSession, trigger})
			return session;
		}
	},
	events: {
		async linkAccount({user, account, profile}) {
			console.log({ event: 'linkAccount', user, account, profile});
			await db.user.update({
				where: { id: user.id},
				data: { emailVerified: new Date()}
			});
		}
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		}),
		Credentials({
			async authorize(credentials) {
				console.log('authorize:', { credentials });
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const user = await getUserByEmail(email);
					if (!user || !user.password)
						return null;
					const passwordMatch = await bcrypt.compare(password, user.password);
					if (passwordMatch)
						return user;
				}
				return null;
			}
		})
	]
});