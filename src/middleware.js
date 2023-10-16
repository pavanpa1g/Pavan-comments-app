import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    // return NextResponse.redirect(new URL('/', request.url))

    const authToken = request.cookies.get("jwt_token");

    const loggedInUserNotAccessPaths = request.nextUrl.pathname === "/login";

    const backloggedINuser = request.nextUrl.pathname === '/api/user/login' || request.nextUrl.pathname === '/api/user/register'

    if (backloggedINuser) {
        return
    }


    if (loggedInUserNotAccessPaths) {
        if (authToken) {
            console.log("middle ware");
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (!authToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        } else {
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/", "/chats", "/profile", "/login"],
};


// "/api/:path*"