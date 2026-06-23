import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import { CLASS_SCHEDULE_ENDPOINTS } from "./class-schedule.constants";
import type {
  ClassScheduleCreateDataT,
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
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<ClassScheduleT>>
      >(
        `${CLASS_SCHEDULE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: ClassScheduleGetParamsT): Promise<ClassScheduleT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ClassScheduleT>>(
        CLASS_SCHEDULE_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: ClassScheduleCreateDataT): Promise<ClassScheduleT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ClassScheduleT>>(
        CLASS_SCHEDULE_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: ClassScheduleUpdateParamsT): Promise<ClassScheduleT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ClassScheduleT>>(
        CLASS_SCHEDULE_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: ClassScheduleDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        CLASS_SCHEDULE_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const classScheduleService = new ClassScheduleService();
