import { BASE_URL } from "@/config";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || " ";

    try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const json = await response.json();
        return Response.json({
            success: response.ok,
            statusCode: response.status,
            message: json.message,
            data: json?.data as User,
        });
    } catch (error) {
        return NextResponse.redirect(new URL("/500", request.url));
    }
}
