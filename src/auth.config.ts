import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

/**
 * To be able to include prisma related objects/calls, this needs to be separated
 * from auth.ts: according to the docs middleware runs in the edge runtime (see
 * middleware.ts) and prisma does not support the edge runtime. 
 */
export default { providers: [
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
] } satisfies NextAuthConfig;