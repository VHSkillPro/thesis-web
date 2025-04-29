"use server";
import { BASE_URL } from "@/config";
import { revalidateTag } from "next/cache";
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

/**
 * Fetches a list of students based on the provided filter criteria.
 *
 * @param {StudentFilter} filter - The filter object containing query parameters for fetching students.
 * @param {number} [filter.page=1] - The page number for pagination.
 * @param {number} [filter.limit=5] - The number of students to fetch per page.
 * @param {string} [filter.username] - The username of the student to filter by.
 * @param {string} [filter.fullname] - The full name of the student to filter by.
 * @param {string} [filter.course] - The course of the student to filter by.
 * @param {string} [filter.className] - The class name of the student to filter by.
 * @param {boolean} [filter.isActive] - The active status of the student to filter by.
 *
 * @returns {Promise<{
 *   message: string;
 *   statusCode: number;
 *   success: boolean;
 *   data?: any;
 *   meta?: any;
 * }>} A promise that resolves to an object containing the response message, status code, success flag,
 * and optionally the data and meta information if the request is successful.
 *
 * @throws {Error} If there is an issue with the fetch request or server error.
 */
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

/**
 * Fetches the base64-encoded card data of a student by their ID.
 *
 * @param {string} studentId - The unique identifier of the student.
 * @returns {Promise<{
 *   message: string;
 *   statusCode: number;
 *   success: boolean;
 *   data?: any;
 * }>} A promise that resolves to an object containing the response message, status code,
 * success status, and optionally the card data if the request is successful.
 *
 * @throws {Error} If there is an issue with the fetch request or server response.
 *
 * Notes:
 * - The function retrieves the `accessToken` from cookies to authorize the request.
 * - If the request is successful, the card data is returned in the `data` field.
 * - In case of an error, an appropriate error message and status code are returned.
 */
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
          tags: ["students"],
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

/**
 * Deletes a student by their ID.
 *
 * This function sends a DELETE request to the server to remove a student
 * identified by the provided `studentId`. It retrieves the access token
 * from cookies to authorize the request.
 *
 * @param {string} studentId - The unique identifier of the student to be deleted.
 * @returns {Promise<{
 *   message: string;
 *   statusCode: number;
 *   success: boolean;
 * }>} A promise that resolves to an object containing:
 * - `message`: A message indicating the result of the operation.
 * - `statusCode`: The HTTP status code of the response.
 * - `success`: A boolean indicating whether the operation was successful.
 *
 * @throws {Error} If an unexpected error occurs during the request.
 */
export async function deleteStudentAction(studentId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || " ";

  try {
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

      return {
        message: body.message,
        statusCode: 200,
        success: true,
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
