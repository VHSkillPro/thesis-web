import { cookies } from "next/headers";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return Response.json({
        success: true,
        statusCode: 200,
        message: "Đăng xuất thành công",
    });
}
