import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedRecoveryProcessesResponse } from "../mappers/recovery-processes.mapper";
import { RECOVERY_PROCESSES_ENDPOINTS } from "../../constants/recovery-processes.constants";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";
import type {
  RecoveryProcessListParamsT,
  RecoveryProcessRepositoryT,
} from "../../domain/repositories/recovery-processes.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const recoveryProcessApiRepository: RecoveryProcessRepositoryT = {
  async list(params?: RecoveryProcessListParamsT): Promise<RecoveryProcessT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<RecoveryProcessT>>(
        `${RECOVERY_PROCESSES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedRecoveryProcessesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<RecoveryProcessT> {
    try {
      const { data } = await apiClient.get<ResponseApi<RecoveryProcessT>>(
        `${RECOVERY_PROCESSES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<RecoveryProcessT, "id" | "period_grade_summary_name" | "managed_by_user_name">): Promise<RecoveryProcessT> {
    try {
      const { data } = await apiClient.post<ResponseApi<RecoveryProcessT>>(
        RECOVERY_PROCESSES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<RecoveryProcessT>): Promise<RecoveryProcessT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<RecoveryProcessT>>(
        `${RECOVERY_PROCESSES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${RECOVERY_PROCESSES_ENDPOINTS.LIST}${id}/`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
