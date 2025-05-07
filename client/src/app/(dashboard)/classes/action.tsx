"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";

export interface ClassesFilterDto {
  id?: string;
  name?: string;
  lecturerId?: string;
  page: number;
  limit: number;
}

function createQueryString(filter: ClassesFilterDto) {
  const queryString = new URLSearchParams();

  if (filter.id) {
    queryString.append("id", filter.id);
  }

  if (filter.name) {
    queryString.append("name", filter.name);
  }

  if (filter.lecturerId) {
    queryString.append("lecturerId", filter.lecturerId);
  }

  if (filter.page) {
    queryString.append("page", filter.page.toString());
  }

  if (filter.limit) {
    queryString.append("limit", filter.limit.toString());
  }

  return queryString.toString();
}

export const getClassesAction = async (filter: ClassesFilterDto) => {
  try {
    const accessToken = await getAccessToken();

    const url = `${BASE_URL}/classes?${createQueryString(filter)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["classes"],
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
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
};
