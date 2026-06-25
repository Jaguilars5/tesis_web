import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { CLASS_SCHEDULE_ENDPOINTS } from "./class-schedule.constants";
import type {
  ClassScheduleCreateParamsT,
  ClassScheduleDeleteParamsT,
  ClassScheduleGetParamsT,
  ClassScheduleListParamsT,
  ClassScheduleServiceT,
  ClassScheduleT,
  ClassScheduleUpdateParamsT,
} from "./class-schedule.types";

class ClassScheduleService implements ClassScheduleServiceT {
  async list(params?: ClassScheduleListParamsT): Promise<ClassScheduleT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const filtersQuery = params?.filters
        ? `&${Object.entries(params.filters)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(
              ([key, value]) => `${key}=${encodeURIComponent(String(value))}`,
            )
            .join("&")}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<ClassScheduleT>>
      >(
        `${CLASS_SCHEDULE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: ClassScheduleGetParamsT): Promise<ClassScheduleT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ClassScheduleT>>(
        CLASS_SCHEDULE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: ClassScheduleCreateParamsT): Promise<ClassScheduleT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ClassScheduleT>>(
        CLASS_SCHEDULE_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: ClassScheduleUpdateParamsT): Promise<ClassScheduleT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ClassScheduleT>>(
        CLASS_SCHEDULE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: ClassScheduleDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        CLASS_SCHEDULE_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const classScheduleService = new ClassScheduleService();
