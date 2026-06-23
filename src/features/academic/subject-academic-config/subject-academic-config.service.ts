import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";

import { SUBJECT_ACADEMIC_CONFIG_ENDPOINTS } from "./subject-academic-config.constants";
import type {
  SubjectAcademicConfigCreateDataT,
  SubjectAcademicConfigDeleteParamsT,
  SubjectAcademicConfigGetParamsT,
  SubjectAcademicConfigListParamsT,
  SubjectAcademicConfigServiceT,
  SubjectAcademicConfigT,
  SubjectAcademicConfigUpdateParamsT,
} from "./subject-academic-config.types";

class SubjectAcademicConfigService implements SubjectAcademicConfigServiceT {
  async list(params?: SubjectAcademicConfigListParamsT): Promise<SubjectAcademicConfigT[]> {
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
        ResponseApi<PaginatedData<SubjectAcademicConfigT>>
      >(
        `${SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: SubjectAcademicConfigGetParamsT): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectAcademicConfigT>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: SubjectAcademicConfigCreateDataT): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectAcademicConfigT>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SubjectAcademicConfigUpdateParamsT): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SubjectAcademicConfigT>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: SubjectAcademicConfigDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectAcademicConfigService = new SubjectAcademicConfigService();
