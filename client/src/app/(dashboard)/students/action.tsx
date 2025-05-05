"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";
import { revalidateTag } from "next/cache";

export interface StudentFilterDto {
  username?: string;
  fullname?: string;
  course?: string;
  className?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export default async function getStudentsAction(filter: StudentFilterDto) {
  try {
    const accessToken = await getAccessToken();
    const baseUrl = `${BASE_URL}/students`;

    const params = new URLSearchParams();
    params.append("page", filter.page?.toString() || "1");
    params.append("limit", filter.limit?.toString() || "5");
    if (filter.username) {
      params.append("username", filter.username);
    }
    if (filter.fullname) {
      params.append("fullname", filter.fullname);
    }
    if (filter.course) {
      params.append("course", filter.course);
    }
    if (filter.className) {
      params.append("className", filter.className);
    }
    if (filter.isActive !== undefined) {
      params.append("isActive", filter.isActive.toString());
    }
    const queryString = params.toString();

    const response = await fetch(`${baseUrl}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["students"],
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
      statusCode: 500,
      success: false,
      message: "Lỗi máy chủ",
    };
  }
}

export async function deleteStudentAction(studentId: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["students"],
      },
    });

    const body = await response.json();
    if (response.ok) {
      revalidateTag("students");
    }

    return {
      success: response.ok,
      statusCode: response.status,
      ...body,
    };
  } catch (error) {
    return {
      message: "Lỗi máy chủ",
      statusCode: 500,
      success: false,
    };
  }
}
