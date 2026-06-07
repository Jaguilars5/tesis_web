import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";
import type {
  Student,
  StudentCreateRequest,
  StudentUpdateRequest,
  StudentDeleteRequest,
} from "../types/student.types";

export class StudentApiService {
  async list(page = 1, pageSize = 20): Promise<Student[]> {
    try {
      const response = await apiClient.get<PaginatedResponseApi<Student>>(
        `/api/students/student/?page=${page}&page_size=${pageSize}`
      );
      return response.data.data.results;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: number): Promise<Student> {
    try {
      const response = await apiClient.get<ResponseApi<Student>>(
        `/api/students/student/${id}/`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: StudentCreateRequest): Promise<Student> {
    try {
      const response = await apiClient.post<ResponseApi<Student>>(
        "/api/students/student/",
        payload
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(payload: StudentUpdateRequest): Promise<Student> {
    try {
      const { id, ...rest } = payload;
      const response = await apiClient.patch<ResponseApi<Student>>(
        `/api/students/student/${id}/`,
        rest
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(payload: StudentDeleteRequest): Promise<Student> {
    try {
      const response = await apiClient.delete<ResponseApi<Student>>(
        `/api/students/student/${payload.id}/`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const studentApiService = new StudentApiService();
