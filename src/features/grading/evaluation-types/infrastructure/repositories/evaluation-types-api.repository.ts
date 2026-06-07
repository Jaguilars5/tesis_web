import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedEvaluationTypesResponse } from "../mappers/evaluation-types.mapper";
import { EVALUATION_TYPES_ENDPOINTS } from "../../constants/evaluation-types.constants";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";
import type {
  EvaluationTypeListParamsT,
  EvaluationTypeRepositoryT,
} from "../../domain/repositories/evaluation-types.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const evaluationTypeApiRepository: EvaluationTypeRepositoryT = {
  async list(params?: EvaluationTypeListParamsT): Promise<EvaluationTypeT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<EvaluationTypeT>>(
        `${EVALUATION_TYPES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedEvaluationTypesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<EvaluationTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<EvaluationTypeT>>(
        `${EVALUATION_TYPES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<EvaluationTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<EvaluationTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationTypeT>>(
        EVALUATION_TYPES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<EvaluationTypeT>): Promise<EvaluationTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<EvaluationTypeT>>(
        `${EVALUATION_TYPES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<EvaluationTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationTypeT>>(
        `${EVALUATION_TYPES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
