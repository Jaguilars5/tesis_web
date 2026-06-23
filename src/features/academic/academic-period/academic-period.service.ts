import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import { ACADEMIC_PERIOD_ENDPOINTS } from "./academic-period.constants";
import type {
  AcademicPeriodCreateDataT,
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
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<AcademicPeriodT>>
      >(
        `${ACADEMIC_PERIOD_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: AcademicPeriodGetParamsT): Promise<AcademicPeriodT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicPeriodT>>(
        ACADEMIC_PERIOD_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: AcademicPeriodCreateDataT): Promise<AcademicPeriodT> {
    try {
      const cleaned = { ...payload };
      if (cleaned.period_type === 0)
        cleaned.period_type = null as unknown as number;
      const { data } = await apiClient.post<ResponseApi<AcademicPeriodT>>(
        ACADEMIC_PERIOD_ENDPOINTS.LIST,
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
        ACADEMIC_PERIOD_ENDPOINTS.DETAIL(params.id),
        cleaned,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: AcademicPeriodDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        ACADEMIC_PERIOD_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const academicPeriodService = new AcademicPeriodService();
