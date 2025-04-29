"use server";
import { BASE_URL } from "@/config";
import { cookies } from "next/headers";

export async function getStudentDetailAction(studentId: string) {
  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("accessToken")?.value || " ";

  try {
    const response = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: json.message,
        statusCode: response.status,
        data: json.data,
      };
    } else {
      return {
        success: false,
        message: json.message,
        statusCode: response.status,
      };
    }
  } catch (error) {
    return {
      sucess: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}

export interface UpdateStudentDto {
  fullname?: string;
  password?: string;
  isActive?: boolean;
  className?: string;
  course?: string;
  card?: any;
}

export async function updateStudentAction(
  studentId: string,
  formData: UpdateStudentDto
) {
  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("accessToken")?.value || " ";

  try {
    const body = new FormData();

    if (formData.fullname) {
      body.append("fullname", formData.fullname);
    }

    if (formData.password) {
      body.append("password", formData.password);
    }

    if (formData.isActive) {
      body.append("isActive", formData.isActive ? "true" : "false");
    }

    if (formData.className) {
      body.append("className", formData.className);
    }

    if (formData.course) {
      body.append("course", formData.course);
    }

    if (formData.card) {
      body.append("card", formData.card.originFileObj);
    }

    const response = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });

    const json = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: json.message,
        statusCode: response.status,
      };
    } else {
      return {
        success: false,
        message: json.message,
        statusCode: response.status,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}
