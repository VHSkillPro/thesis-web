"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export interface UpdateStudentDto {
  fullname?: string;
  password?: string;
  isActive?: boolean;
  className?: string;
  course?: string;
  card?: any;
}

export async function getStudentDetailAction(studentId: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["student"],
      },
    });

    const json = await response.json();
    return {
      success: response.ok,
      statusCode: response.status,
      ...json,
    };
  } catch (error) {
    return {
      sucess: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
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
    return {
      success: response.ok,
      statusCode: response.status,
      ...json,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}

export async function getSelfiesAction(studentId: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${BASE_URL}/students/${studentId}/faces`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["faces"],
      },
    });

    const json = await response.json();
    return {
      success: response.ok,
      statusCode: response.status,
      ...json,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}

export async function deleteSelfieAction(studentId: string, selfieId: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${BASE_URL}/students/${studentId}/faces/${selfieId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const json = await response.json();
    if (response.ok) {
      revalidateTag("faces");
    }
    return {
      success: response.ok,
      statusCode: response.status,
      ...json,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}

export async function addSelfieAction(studentId: string, selfie: any) {
  try {
    const accessToken = await getAccessToken();

    const body = new FormData();
    body.append("selfie", selfie.originFileObj);

    const response = await fetch(`${BASE_URL}/students/${studentId}/faces`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });

    const json = await response.json();
    if (response.ok) {
      revalidateTag("faces");
    }
    return {
      success: response.ok,
      statusCode: response.status,
      ...json,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi máy chủ",
      statusCode: 500,
    };
  }
}
