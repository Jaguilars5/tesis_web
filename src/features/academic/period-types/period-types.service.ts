import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import { PERIOD_TYPE_ENDPOINTS } from "./period-types.constants";
import type {
  PeriodTypeCreateDataT,
  PeriodTypeDeleteParamsT,
  PeriodTypeGetParamsT,
  PeriodTypeListParamsT,
  PeriodTypeServiceT,
  PeriodTypeT,
  PeriodTypeUpdateParamsT,
} from "./period-types.types";

class PeriodTypeService implements PeriodTypeServiceT {
  async list(params?: PeriodTypeListParamsT): Promise<PeriodTypeT[]> {
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
        ResponseApi<PaginatedData<PeriodTypeT>>
      >(
        `${PERIOD_TYPE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: PeriodTypeGetParamsT): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: PeriodTypeCreateDataT): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: PeriodTypeDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        PERIOD_TYPE_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const periodTypeService = new PeriodTypeService();
