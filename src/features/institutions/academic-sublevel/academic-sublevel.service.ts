import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import { ACADEMIC_SUBLEVEL_ENDPOINTS } from "./academic-sublevel.constants";
import type {
  AcademicSubLevelCreateParamsT,
  AcademicSubLevelDeleteParamsT,
  AcademicSubLevelGetParamsT,
  AcademicSubLevelListParamsT,
  AcademicSubLevelServiceT,
  AcademicSubLevelT,
  AcademicSubLevelUpdateParamsT,
} from "./academic-sublevel.types";

class AcademicSubLevelService implements AcademicSubLevelServiceT {
  async get(params: AcademicSubLevelGetParamsT): Promise<AcademicSubLevelT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicSubLevelT>>(
        ACADEMIC_SUBLEVEL_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async list(
    params?: AcademicSubLevelListParamsT,
  ): Promise<AcademicSubLevelT[]> {
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

      console.log(
        "URL",
        `${ACADEMIC_SUBLEVEL_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<AcademicSubLevelT>>
      >(
        `${ACADEMIC_SUBLEVEL_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      console.log("DATA", data.data.results);
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    params: AcademicSubLevelCreateParamsT,
  ): Promise<AcademicSubLevelT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicSubLevelT>>(
        ACADEMIC_SUBLEVEL_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(
    params: AcademicSubLevelUpdateParamsT,
  ): Promise<AcademicSubLevelT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicSubLevelT>>(
        ACADEMIC_SUBLEVEL_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: AcademicSubLevelDeleteParamsT,
  ): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        ACADEMIC_SUBLEVEL_ENDPOINTS.SOFT_DELETE(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const academicSubLevelService = new AcademicSubLevelService();
