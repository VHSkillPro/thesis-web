import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "./config";

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - 500 (error page)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|500).*)",
    ],
};

interface MeResponse {
    success: boolean;
    message: string;
    data?: {
        username: string;
        fullname: string;
        isActive: boolean;
        roleId: string;
    };
    statusCode: number;
}

/**
 * Fetches the profile information of the authenticated user using the provided access token.
 *
 * @param accessToken - The access token used for authentication in the request.
 * @returns A promise that resolves to a `MeResponse` object containing:
 * - `success`: A boolean indicating whether the request was successful.
 * - `message`: A string message describing the result of the request.
 * - `data`: The user's profile data if the request was successful, or `undefined` otherwise.
 * - `statusCode`: The HTTP status code of the response.
 *
 * If an error occurs during the request, the function returns a `MeResponse` object
 * with `success` set to `false`, a generic error message, and a status code of 500.
 */
async function getProfile(accessToken: string) {
    try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const json = await response.json();
        return {
            success: response.ok,
            message: json.message,
            data: json?.data,
            statusCode: response.status,
        } as MeResponse;
    } catch (error) {
        return {
            success: false,
            message: "Máy chủ không phản hồi",
            statusCode: 500,
        } as MeResponse;
    }
}

interface RefreshResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
        refreshToken: string;
    };
    statusCode: number;
}

/**
 * Refreshes the authentication tokens by sending a request to the server.
 *
 * @param refreshToken - The refresh token used to obtain new authentication tokens.
 * @returns A promise that resolves to a `RefreshResponse` object containing:
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string message providing additional information about the result.
 * - `data`: The refreshed token data, if the operation was successful.
 * - `statusCode`: The HTTP status code of the response.
 *
 * If the server does not respond or an error occurs, the function returns a
 * `RefreshResponse` object with `success` set to `false`, a default error message,
 * and a status code of 500.
 */
async function refreshTokens(refreshToken: string) {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        const json = await response.json();
        return {
            success: response.ok,
            message: json.message,
            data: json?.data,
            statusCode: response.status,
        } as RefreshResponse;
    } catch (error) {
        return {
            success: false,
            message: "Máy chủ không phản hồi",
            statusCode: 500,
        } as RefreshResponse;
    }
}

/**
 * Handles redirection to the login page and clears authentication cookies.
 *
 * This middleware function checks if the incoming request is targeting the login page.
 * If the request is not for the login page, it redirects the user to the login page
 * and deletes the `accessToken` and `refreshToken` cookies from the response.
 * If the request is for the login page, it proceeds with the request while still
 * clearing the authentication cookies.
 *
 * @param request - The incoming `NextRequest` object representing the HTTP request.
 * @returns A `NextResponse` object that either redirects to the login page or
 *          allows the request to proceed, with authentication cookies removed.
 */
function redirectLogin(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");

    if (!isLoginPage) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
}

export default async function middleware(request: NextRequest) {
    console.log("Middleware triggered", request.nextUrl.pathname);

    const cookies = request.cookies;
    const accessToken = cookies.get("accessToken")?.value || " ";
    const refreshToken = cookies.get("refreshToken")?.value;

    const globalResponse = request.nextUrl.pathname.startsWith("/login")
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next();

    const verifyResponse = await getProfile(accessToken);
    if (verifyResponse.success) {
        return globalResponse;
    } else if (verifyResponse.statusCode === 500) {
        return NextResponse.redirect(new URL("/500", request.url));
    } else {
        if (!refreshToken) {
            return redirectLogin(request);
        }

        const refreshResponse = await refreshTokens(refreshToken);
        if (refreshResponse.success) {
            const newAccessToken = refreshResponse.data?.accessToken || " ";
            const newRefreshToken = refreshResponse.data?.refreshToken || " ";

            const accessTokenMaxAge = 10 * 60; // 10 minutes
            const refreshTokenMaxAge = 24 * 60 * 60; // 1 days

            globalResponse.cookies.set("accessToken", newAccessToken, {
                httpOnly: true, // Quan trọng nhất!
                secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS ở production
                maxAge: accessTokenMaxAge, // Thời gian sống (giây)
                path: "/", // Áp dụng cho toàn bộ website
                sameSite: "lax", // Hoặc 'strict'. Chống CSRF
            });

            globalResponse.cookies.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: refreshTokenMaxAge,
                path: "/",
                sameSite: "lax",
            });

            globalResponse.headers.set(
                "Authorization",
                `Bearer ${newAccessToken}`
            );
            return globalResponse;
        } else if (refreshResponse.statusCode === 500) {
            return NextResponse.redirect(new URL("/500", request.url));
        } else {
            return redirectLogin(request);
        }
    }
}
