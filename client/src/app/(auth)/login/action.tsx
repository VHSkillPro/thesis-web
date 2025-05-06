"use server";
import { BASE_URL } from "../../../config";
import { cookies } from "next/headers";

export interface LoginFormData {
  username: string;
  password: string;
}

interface ActionResult {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  statusCode?: number;
}

export default async function loginAction(
  formData: LoginFormData
): Promise<ActionResult> {
  try {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (response.ok) {
      if (responseBody.data?.accessToken && responseBody.data?.refreshToken) {
        const cookieStore = await cookies();
        const accessTokenMaxAge = 600; // 10 minutes
        const refreshTokenMaxAge = 86400; // 1 day
        cookieStore.set("accessToken", responseBody.data.accessToken, {
          httpOnly: true, // Quan trọng nhất!
          secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS ở production
          maxAge: accessTokenMaxAge, // Thời gian sống (giây)
          path: "/", // Áp dụng cho toàn bộ website
          sameSite: "lax", // Hoặc 'strict'. Chống CSRF
        });

        cookieStore.set("refreshToken", responseBody.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: refreshTokenMaxAge,
          path: "/",
          sameSite: "lax",
        });
      }

      return {
        success: true,
        message: responseBody.message || "Đăng nhập thành công!",
        data: responseBody.data,
        statusCode: response.status,
      };
    } else {
      return {
        success: false,
        message:
          responseBody.message || `Lỗi ${response.status}: Có lỗi xảy ra.`,
        statusCode: response.status,
      };
    }
  } catch (error) {
    console.error("API Call Error:", error);
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ hoặc có lỗi xảy ra.",
      statusCode: 500,
    };
  }
}
