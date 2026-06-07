import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";
import type {
  Representative,
  RepresentativeCreateRequest,
  RepresentativeUpdateRequest,
  RepresentativeDeleteRequest,
} from "../types/representative.types";

export class RepresentativeApiService {
  async list(page = 1, pageSize = 20): Promise<Representative[]> {
    try {
      const response = await apiClient.get<PaginatedResponseApi<Representative>>(
        `/api/students/representative/?page=${page}&page_size=${pageSize}`
      );
      return response.data.data.results;
    } catch (error) {
      console.error("Error fetching representatives:", error);
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: number): Promise<Representative> {
    try {
      const response = await apiClient.get<ResponseApi<Representative>>(
        `/api/students/representative/${id}/`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: RepresentativeCreateRequest): Promise<Representative> {
    try {
      const response = await apiClient.post<ResponseApi<Representative>>(
        "/api/students/representative/",
        payload
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(payload: RepresentativeUpdateRequest): Promise<Representative> {
    try {
      const { id, ...rest } = payload;
      const response = await apiClient.patch<ResponseApi<Representative>>(
        `/api/students/representative/${id}/`,
        rest
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(payload: RepresentativeDeleteRequest): Promise<Representative> {
    try {
      const response = await apiClient.delete<ResponseApi<Representative>>(
        `/api/students/representative/${payload.id}/`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const representativeApiService = new RepresentativeApiService();
