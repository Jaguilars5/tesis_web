import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedGradeTypesResponse } from "../mappers/grade-types.mapper";
import { GRADE_TYPES_ENDPOINTS } from "../../constants/grade-types.constants";
import type { GradeTypeT } from "../../domain/entities/grade-types.types";
import type {
  GradeTypeListParamsT,
  GradeTypeRepositoryT,
} from "../../domain/repositories/grade-types.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const gradeTypeApiRepository: GradeTypeRepositoryT = {
  async list(params?: GradeTypeListParamsT): Promise<GradeTypeT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<GradeTypeT>>(
        `${GRADE_TYPES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedGradeTypesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<GradeTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<GradeTypeT>>(
        `${GRADE_TYPES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<GradeTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<GradeTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<GradeTypeT>>(
        GRADE_TYPES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<GradeTypeT>): Promise<GradeTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<GradeTypeT>>(
        `${GRADE_TYPES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<GradeTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<GradeTypeT>>(
        `${GRADE_TYPES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
