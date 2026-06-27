import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  PaginatedResult,
  ResponseApi,
} from "@shared/types/api.response.types";

import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { PERIOD_TYPE_ENDPOINTS } from "./period-types.constants";
import type {
  PeriodTypeCreateParamsT,
  PeriodTypeDeleteParamsT,
  PeriodTypeGetParamsT,
  PeriodTypeListParamsT,
  PeriodTypeServiceT,
  PeriodTypeT,
  PeriodTypeUpdateParamsT,
} from "./period-types.types";

class PeriodTypeService implements PeriodTypeServiceT {
  async list(params?: PeriodTypeListParamsT): Promise<PaginatedResult<PeriodTypeT>> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<PeriodTypeT>>>(
        `${PERIOD_TYPE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: PeriodTypeGetParamsT): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: PeriodTypeCreateParamsT): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PeriodTypeT>>(
        PERIOD_TYPE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: PeriodTypeDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        PERIOD_TYPE_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const periodTypeService = new PeriodTypeService();
