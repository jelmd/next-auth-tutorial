import authConfig from "@/auth.config";
import NextAuth from "next-auth"
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes"

const { auth } = NextAuth(authConfig);
export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const { nextUrl } = req;
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	console.log('MiddleAuth:', req.nextUrl.pathname, isLoggedIn);

	if (isApiAuthRoute)
		return;

	if (isAuthRoute) {
		if (isLoggedIn)
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		return;
	}
	if (isLoggedIn || isPublicRoute)
		return;

	// pass the destination URL as login param so that login can redirect to
	// it after successful authentication
	var cbUrl = nextUrl.pathname;
	if (nextUrl.search)
		cbUrl += nextUrl.search;
	cbUrl = encodeURIComponent(cbUrl);
	return Response.redirect(new URL('/auth/login?callbackUrl=' + cbUrl, nextUrl));
});

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: [
		//'/((?!api|_next/static|_next/image|favicon.ico).*)',
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}