"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";
import { revalidateTag } from "next/cache";
import { StudentFilterDto } from "../../students/action";

interface UpdateClassDto {
  name?: string;
  lecturerId?: string;
}

export const getClassDetailAction = async (id: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/classes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["classes"],
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

export const updateClassAction = async (id: string, data: UpdateClassDto) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/classes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      next: {
        tags: ["classes"],
      },
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

export const getStudentsClassAction = async (
  id: string,
  filter: StudentFilterDto
) => {
  try {
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

    const accessToken = await getAccessToken();
    const response = await fetch(
      `${BASE_URL}/classes/${id}/students?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: ["students"],
        },
      }
    );

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

export const addStudentToClassAction = async (
  id: string,
  studentId: string
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${BASE_URL}/classes/${id}/students/${studentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: ["students"],
        },
      }
    );

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
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};

export const deleteStudentFromClassAction = async (
  id: string,
  studentId: string
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${BASE_URL}/classes/${id}/students/${studentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: ["students"],
        },
      }
    );

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
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};
