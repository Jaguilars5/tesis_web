import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedActivityTypesResponse } from "../mappers/activity-types.mapper";
import { ACTIVITY_TYPES_ENDPOINTS } from "../../constants/activity-types.constants";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";
import type {
  ActivityTypeListParamsT,
  ActivityTypeRepositoryT,
} from "../../domain/repositories/activity-types.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const activityTypeApiRepository: ActivityTypeRepositoryT = {
  async list(params?: ActivityTypeListParamsT): Promise<ActivityTypeT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<ActivityTypeT>>(
        `${ACTIVITY_TYPES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedActivityTypesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ActivityTypeT>>(
        `${ACTIVITY_TYPES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<ActivityTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ActivityTypeT>>(
        ACTIVITY_TYPES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<ActivityTypeT>): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ActivityTypeT>>(
        `${ACTIVITY_TYPES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ActivityTypeT>>(
        `${ACTIVITY_TYPES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
