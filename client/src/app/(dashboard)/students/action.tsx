"use server";
import { BASE_URL } from "@/config";
import { cookies } from "next/headers";

export interface StudentFilter {
  username?: string;
  fullname?: string;
  course?: string;
  className?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export default async function getStudentsAction(filter: StudentFilter) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || " ";

  try {
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
    if (response.ok) {
      return {
        message: body.message,
        statusCode: 200,
        success: true,
        data: body.data,
        meta: body.meta,
      };
    } else {
      return {
        message: body.message || "Lỗi máy chủ",
        statusCode: response.status,
        success: false,
      };
    }
  } catch (error) {
    return {
      message: "Lỗi máy chủ",
      statusCode: 500,
      success: false,
    };
  }
}

export async function getCardOfStudentAction(studentId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || " ";

  try {
    const response = await fetch(
      `${BASE_URL}/students/${studentId}/card/base64`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: ["students_card"],
        },
      }
    );

    const body = await response.json();
    if (response.ok) {
      return {
        message: body.message,
        statusCode: 200,
        success: true,
        data: body.data,
      };
    } else {
      return {
        message: body.message || "Lỗi máy chủ",
        statusCode: response.status,
        success: false,
      };
    }
  } catch (error) {
    return {
      message: "Lỗi máy chủ",
      statusCode: 500,
      success: false,
    };
  }
}
