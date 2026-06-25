import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import { ACADEMIC_PERIOD_ENDPOINTS } from "./academic-period.constants";
import type {
  AcademicPeriodCreateParamsT,
  AcademicPeriodDeleteParamsT,
  AcademicPeriodGetParamsT,
  AcademicPeriodListParamsT,
  AcademicPeriodServiceT,
  AcademicPeriodT,
  AcademicPeriodUpdateParamsT,
} from "./academic-period.types";

class AcademicPeriodService implements AcademicPeriodServiceT {
  async list(params?: AcademicPeriodListParamsT): Promise<AcademicPeriodT[]> {
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
        ResponseApi<PaginatedData<AcademicPeriodT>>
      >(
        `${ACADEMIC_PERIOD_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: AcademicPeriodGetParamsT): Promise<AcademicPeriodT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicPeriodT>>(
        ACADEMIC_PERIOD_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: AcademicPeriodCreateParamsT): Promise<AcademicPeriodT> {
    try {
      const cleaned = { ...params };
      if (cleaned.period_type === 0)
        cleaned.period_type = null as unknown as number;
      const { data } = await apiClient.post<ResponseApi<AcademicPeriodT>>(
        ACADEMIC_PERIOD_ENDPOINTS.CREATE,
        cleaned,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AcademicPeriodUpdateParamsT): Promise<AcademicPeriodT> {
    try {
      const cleaned = { ...params.data };
      if (cleaned.period_type === 0)
        cleaned.period_type = null as unknown as number;
      const { data } = await apiClient.patch<ResponseApi<AcademicPeriodT>>(
        ACADEMIC_PERIOD_ENDPOINTS.UPDATE(params.id),
        cleaned,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: AcademicPeriodDeleteParamsT,
  ): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        ACADEMIC_PERIOD_ENDPOINTS.SOFT_DELETE(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const academicPeriodService = new AcademicPeriodService();
