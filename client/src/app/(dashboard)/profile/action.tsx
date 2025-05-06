"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";

export interface ChangePasswordDto {
  oldPassword: string;
  password: string;
}

export const getUserDetailAction = async (username: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["users"],
      },
    });

    const data = await response.json();
    return {
      success: response.ok,
      statusCode: response.status,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};

export const changePasswordAction = async (
  username: string,
  data: ChangePasswordDto
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${BASE_URL}/users/${username}/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    return {
      success: response.ok,
      statusCode: response.status,
      ...result,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};
