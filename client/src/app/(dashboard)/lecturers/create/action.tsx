"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";

export interface CreateLecturerDto {
  username: string;
  password: string;
  fullname: string;
  isActive: boolean;
}

export const createLecturerAction = async (formData: CreateLecturerDto) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/lecturers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
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
