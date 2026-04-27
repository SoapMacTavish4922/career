import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/portal", "/edit-details", "/profile"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const userInfo = request.cookies.get("user_info")?.value;
    const pathname = request.nextUrl.pathname;

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isRegistration = pathname.startsWith("/registration");

    let isProfileComplete = false;
    if (userInfo) {
        try {
            const user = JSON.parse(userInfo);
            isProfileComplete = user.is_profile_complete;
        } catch { }
    }

    if ((isProtected || isRegistration) && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // if (token && !isProfileComplete && isProtected) {
    //     return NextResponse.redirect(new URL("/registration", request.url));
    // }

    if (token && isProfileComplete && isRegistration) {
        return NextResponse.redirect(new URL("/portal/search-jobs", request.url));
    }

    if (isAuthRoute && token) {
        if (isProfileComplete) {
            return NextResponse.redirect(new URL("/portal/search-jobs", request.url));
        } else {
            return NextResponse.redirect(new URL("/registration", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/portal/:path*",
        "/registration/:path*",
        "/login",
        "/signup",
        "/forgot-password",
    ],
};