import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  PaginatedResult,
  ResponseApi,
} from "@shared/types/api.response.types";

import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { SUBJECT_ACADEMIC_CONFIG_ENDPOINTS } from "./subject-academic-config.constants";
import type {
  SubjectAcademicConfigCreateParamsT,
  SubjectAcademicConfigDeleteParamsT,
  SubjectAcademicConfigGetParamsT,
  SubjectAcademicConfigListParamsT,
  SubjectAcademicConfigServiceT,
  SubjectAcademicConfigT,
  SubjectAcademicConfigUpdateParamsT,
} from "./subject-academic-config.types";

class SubjectAcademicConfigService implements SubjectAcademicConfigServiceT {
  async list(params?: SubjectAcademicConfigListParamsT): Promise<PaginatedResult<SubjectAcademicConfigT>> {
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
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SubjectAcademicConfigT>>>(
        `${SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(
    params: SubjectAcademicConfigGetParamsT,
  ): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectAcademicConfigT>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    params: SubjectAcademicConfigCreateParamsT,
  ): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectAcademicConfigT>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(
    params: SubjectAcademicConfigUpdateParamsT,
  ): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.patch<
        ResponseApi<SubjectAcademicConfigT>
      >(SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.UPDATE(params.id), params.data);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: SubjectAcademicConfigDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectAcademicConfigService = new SubjectAcademicConfigService();
