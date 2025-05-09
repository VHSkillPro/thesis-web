"use server";
import { BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/tokens";
import { revalidateTag } from "next/cache";

export interface LecturerDto {
  username: string;
  fullname: string;
  isActive: boolean;
}

export interface FilterLecturerDto {
  username?: string;
  fullname?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Constructs a query string from the given filter object for lecturers.
 *
 * @param filter - An object containing filter criteria for lecturers.
 *   - `username` (optional): The username of the lecturer to filter by.
 *   - `fullname` (optional): The full name of the lecturer to filter by.
 *   - `isActive` (optional): A boolean indicating whether to filter by active status.
 *   - `page` (optional): The page number for pagination.
 *   - `limit` (optional): The number of items per page for pagination.
 *
 * @returns A URL-encoded query string representing the filter criteria.
 */
function createQueryString(filter: FilterLecturerDto) {
  const queryString = new URLSearchParams();

  if (filter.username) {
    queryString.append("username", filter.username);
  }

  if (filter.fullname) {
    queryString.append("fullname", filter.fullname);
  }

  if (filter.isActive !== undefined) {
    queryString.append("isActive", filter.isActive ? "true" : "false");
  }

  if (filter.page) {
    queryString.append("page", filter.page.toString());
  }

  if (filter.limit) {
    queryString.append("limit", filter.limit.toString());
  }

  return queryString.toString();
}

export async function getLecturersAction(filter: FilterLecturerDto) {
  try {
    const response = await fetch(
      `${BASE_URL}/lecturers?${createQueryString(filter)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        next: {
          tags: ["lecturers"],
        },
      }
    );

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
}

export async function deleteLecturerAction(username: string) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${BASE_URL}/lecturers/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["lecturers"],
      },
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
}

export async function getAllLecturersAction() {
  try {
    const accessToken = await getAccessToken();
    const firstRes = await fetch(`${BASE_URL}/lecturers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ["lecturers"],
      },
    });

    const firstBody = await firstRes.json();
    if (!firstRes.ok) {
      return {
        success: false,
        statusCode: firstRes.status,
        ...firstBody,
      };
    }

    const totalPages = firstBody.meta.pages;
    const allLecturers: LecturerDto[] = [...firstBody.data];

    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(
        fetch(`${BASE_URL}/lecturers?page=${i}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          next: {
            tags: ["lecturers"],
          },
        })
      );
    }

    const responses = await Promise.all(promises);
    for (const res of responses) {
      const body = await res.json();
      if (res.ok) {
        allLecturers.push(...body.data);
      } else {
        return {
          success: false,
          statusCode: res.status,
          ...body,
        };
      }
    }

    return {
      success: true,
      statusCode: 200,
      data: allLecturers,
      meta: {
        total: allLecturers.length,
        page: 1,
        limit: allLecturers.length,
        pages: 1,
      },
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ",
    };
  }
}
