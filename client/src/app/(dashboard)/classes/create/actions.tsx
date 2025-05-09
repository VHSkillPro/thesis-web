"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";
import { revalidateTag } from "next/cache";

export interface CreateClassesDto {
  id: string;
  name: string;
  lecturerId: string;
}

export const createClassesAction = async (values: CreateClassesDto) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${BASE_URL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    });

    const body = await response.json();
    if (response.ok) {
      revalidateTag("classes");
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
