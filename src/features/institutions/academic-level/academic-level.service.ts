import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import { ACADEMIC_LEVEL_ENDPOINTS } from "./academic-level.constants";
import type {
  AcademicLevelCreateParamsT,
  AcademicLevelDeleteParamsT,
  AcademicLevelGetParamsT,
  AcademicLevelListParamsT,
  AcademicLevelServiceT,
  AcademicLevelT,
  AcademicLevelUpdateParamsT,
} from "./academic-level.types";
class AcademicLevelService implements AcademicLevelServiceT {
  async get(params: AcademicLevelGetParamsT): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicLevelT>>(
        ACADEMIC_LEVEL_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async list(params?: AcademicLevelListParamsT): Promise<AcademicLevelT[]> {
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
        ResponseApi<PaginatedData<AcademicLevelT>>
      >(
        `${ACADEMIC_LEVEL_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: AcademicLevelCreateParamsT): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicLevelT>>(
        ACADEMIC_LEVEL_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AcademicLevelUpdateParamsT): Promise<AcademicLevelT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicLevelT>>(
        ACADEMIC_LEVEL_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: AcademicLevelDeleteParamsT,
  ): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        ACADEMIC_LEVEL_ENDPOINTS.SOFT_DELETE(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}
export const academicLevelService = new AcademicLevelService();
