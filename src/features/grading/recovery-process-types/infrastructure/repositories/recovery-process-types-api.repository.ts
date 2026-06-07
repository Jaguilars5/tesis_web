import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedRecoveryProcessTypesResponse } from "../mappers/recovery-process-types.mapper";
import { RECOVERY_PROCESS_TYPES_ENDPOINTS } from "../../constants/recovery-process-types.constants";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";
import type {
  RecoveryProcessTypeListParamsT,
  RecoveryProcessTypeRepositoryT,
} from "../../domain/repositories/recovery-process-types.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const recoveryProcessTypeApiRepository: RecoveryProcessTypeRepositoryT = {
  async list(params?: RecoveryProcessTypeListParamsT): Promise<RecoveryProcessTypeT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<RecoveryProcessTypeT>>(
        `${RECOVERY_PROCESS_TYPES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedRecoveryProcessTypesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<RecoveryProcessTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<RecoveryProcessTypeT>>(
        `${RECOVERY_PROCESS_TYPES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<RecoveryProcessTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<RecoveryProcessTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<RecoveryProcessTypeT>>(
        RECOVERY_PROCESS_TYPES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<RecoveryProcessTypeT>): Promise<RecoveryProcessTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<RecoveryProcessTypeT>>(
        `${RECOVERY_PROCESS_TYPES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<RecoveryProcessTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<RecoveryProcessTypeT>>(
        `${RECOVERY_PROCESS_TYPES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
