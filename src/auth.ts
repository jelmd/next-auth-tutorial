import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getFactorTwoIdByUserId } from "./data/two-factor-map"

export type Role = UserRole;

declare module "next-auth" {
	interface Session {
		user: {
			role: Role
		} & DefaultSession['user'];
	}
}

declare module "@auth/core/jwt" {
	interface JWT extends DefaultJWT {
		role?: Role
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
				if (existingUser)
					token.role = existingUser.role;
			}
			console.log({callback: 'jwt', token, user, account, profile, trigger, session});
			return token;
		},
		async session({ session, user, token, newSession, trigger}) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
				if (token['role'])
					session.user.role = token.role;
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
	...authConfig
});