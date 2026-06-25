import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import { SECTION_ENDPOINTS } from "./section.constants";
import type {
  SectionCreateParamsT,
  SectionDeleteParamsT,
  SectionGetParamsT,
  SectionListParamsT,
  SectionServiceT,
  SectionT,
  SectionUpdateParamsT,
} from "./section.types";

class SectionService implements SectionServiceT {
  async list(params?: SectionListParamsT): Promise<SectionT[]> {
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
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SectionT>>>(
        `${SECTION_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: SectionGetParamsT): Promise<SectionT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SectionT>>(
        SECTION_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: SectionCreateParamsT): Promise<SectionT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SectionT>>(
        SECTION_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SectionUpdateParamsT): Promise<SectionT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SectionT>>(
        SECTION_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: SectionDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        SECTION_ENDPOINTS.SOFT_DELETE(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const sectionService = new SectionService();
