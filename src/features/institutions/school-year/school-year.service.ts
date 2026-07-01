import { apiClient, getApiErrorMessage } from "@shared/services/api.client";

import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import { SCHOOL_YEAR_ENDPOINTS } from "./school-year.constants";

import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import type {
  SchoolYearCreateParamsT,
  SchoolYearDeleteParamsT,
  SchoolYearGetParamsT,
  SchoolYearListParamsT,
  SchoolYearServiceT,
  SchoolYearT,
  SchoolYearUpdateParamsT,
} from "./school-year.types";

class SchoolYearService implements SchoolYearServiceT {
  async get(params: SchoolYearGetParamsT): Promise<SchoolYearT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SchoolYearT>>(
        SCHOOL_YEAR_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async list(params?: SchoolYearListParamsT): Promise<SchoolYearT[]> {
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
            .map(
              ([key, value]) => `${key}=${encodeURIComponent(String(value))}`,
            )
            .join("&")}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<SchoolYearT>>
      >(
        `${SCHOOL_YEAR_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: SchoolYearCreateParamsT): Promise<SchoolYearT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SchoolYearT>>(
        SCHOOL_YEAR_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SchoolYearUpdateParamsT): Promise<SchoolYearT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SchoolYearT>>(
        SCHOOL_YEAR_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: SchoolYearDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        SCHOOL_YEAR_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const schoolYearService = new SchoolYearService();
