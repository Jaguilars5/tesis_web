import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { ACADEMIC_LEVEL_ENDPOINTS } from "../../constants";
import type { AcademicLevelRepositoryT, AcademicLevelListParamsT } from "../../domain/repositories/academic-level.repository";
import type { AcademicLevelT } from "../../domain/entities/academic-level.types";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export class AcademicLevelApiRepository implements AcademicLevelRepositoryT {
  async list(params?: AcademicLevelListParamsT): Promise<AcademicLevelT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const { data } = await apiClient.get<PaginatedResponseApi<AcademicLevelT>>(
        `${ACADEMIC_LEVEL_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: number): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicLevelT>>(
        `${ACADEMIC_LEVEL_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: Omit<AcademicLevelT, "id" | "is_active">): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicLevelT>>(
        `${ACADEMIC_LEVEL_ENDPOINTS.LIST}`,
        { academic_level: payload },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(id: number, payload: Partial<AcademicLevelT>): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicLevelT>>(
        `${ACADEMIC_LEVEL_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: number): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicLevelT>>(
        `${ACADEMIC_LEVEL_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const academicLevelApiRepository = new AcademicLevelApiRepository();
