"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";
import { revalidateTag } from "next/cache";

export interface UpdateLecturerDto {
  fullname?: string;
  password?: string;
  username?: string;
  isActive?: boolean;
}

export const getLecturerDetailAction = async (lecturerId: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/lecturers/${lecturerId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["lecturers"],
      },
    });

    const body = await response.json();
    return {
      success: response.ok,
      statusCode: response.status,
      ...body,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};

export const updateLecturerAction = async (
  username: string,
  formData: UpdateLecturerDto
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/lecturers/${username}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const body = await response.json();
    if (response.ok) {
      revalidateTag("lecturers");
    }
    return {
      success: response.ok,
      statusCode: response.status,
      ...body,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};
