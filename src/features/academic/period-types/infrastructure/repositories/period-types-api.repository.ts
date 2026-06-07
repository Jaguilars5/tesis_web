import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedPeriodTypeResponse } from "../mappers/period-types.mapper";
import { PERIOD_TYPE_ENDPOINTS } from "../../constants/period-types.constants";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";
import type {
  PeriodTypeListParamsT,
  PeriodTypeRepositoryT,
} from "../../domain/repositories/period-types.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const periodTypeApiRepository: PeriodTypeRepositoryT = {
  async list(params?: PeriodTypeListParamsT): Promise<PeriodTypeT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<PeriodTypeT>>(
        `${PERIOD_TYPE_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedPeriodTypeResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PeriodTypeT>>(
        `${PERIOD_TYPE_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<PeriodTypeT, "id" | "is_active">): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<PeriodTypeT>): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PeriodTypeT>>(
        `${PERIOD_TYPE_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PeriodTypeT>>(
        `${PERIOD_TYPE_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
