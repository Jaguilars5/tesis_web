import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import { ACADEMIC_GRADE_ENDPOINTS } from "./academic-grade.constants";
import type {
  AcademicGradeCreateParamsT,
  AcademicGradeDeleteParamsT,
  AcademicGradeGetParamsT,
  AcademicGradeListParamsT,
  AcademicGradeServiceT,
  AcademicGradeT,
  AcademicGradeUpdateParamsT,
} from "./academic-grade.types";

class AcademicGradeService implements AcademicGradeServiceT {
  async get(params: AcademicGradeGetParamsT): Promise<AcademicGradeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicGradeT>>(
        ACADEMIC_GRADE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async list(params?: AcademicGradeListParamsT): Promise<AcademicGradeT[]> {
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
        ResponseApi<PaginatedData<AcademicGradeT>>
      >(
        `${ACADEMIC_GRADE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: AcademicGradeCreateParamsT): Promise<AcademicGradeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicGradeT>>(
        ACADEMIC_GRADE_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AcademicGradeUpdateParamsT): Promise<AcademicGradeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicGradeT>>(
        ACADEMIC_GRADE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: AcademicGradeDeleteParamsT,
  ): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        ACADEMIC_GRADE_ENDPOINTS.SOFT_DELETE(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}
export const academicGradeService = new AcademicGradeService();
