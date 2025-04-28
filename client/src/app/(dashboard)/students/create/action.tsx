"use server";
import { BASE_URL } from "@/config";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export interface CreateStudentDto {
  username: string;
  password: string;
  fullname: string;
  isActive: boolean;
  className: string;
  course: string;
  card: any;
}

export default async function createStudentAction(formData: CreateStudentDto) {
  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("accessToken")?.value || " ";

  const body = new FormData();
  body.append("username", formData.username);
  body.append("password", formData.password);
  body.append("fullname", formData.fullname);
  body.append("isActive", formData.isActive ? "true" : "false");
  body.append("className", formData.className);
  body.append("course", formData.course);
  body.append("card", formData.card[0].originFileObj);

  try {
    const response = await fetch(`${BASE_URL}/students/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });

    if (response.ok) {
      revalidateTag("students");
    }

    const json = await response.json();
    return {
      success: response.ok,
      message: json.message,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}
