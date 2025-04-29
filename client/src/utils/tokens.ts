"use server";
import { cookies } from "next/headers";

export async function getAccessToken() {
    const cookiesStorage = await cookies();
    return cookiesStorage.get("accessToken")?.value;
}

export async function getRefreshToken() {
    const cookiesStorage = await cookies();
    return cookiesStorage.get("refreshToken")?.value;
}
