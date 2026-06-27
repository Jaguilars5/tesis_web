import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  PaginatedResult,
  ResponseApi,
} from "@shared/types/api.response.types";

import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { SUBJECT_ENDPOINTS } from "./subject.constants";
import type {
  SubjectCreateParamsT,
  SubjectDeleteParamsT,
  SubjectGetParamsT,
  SubjectListParamsT,
  SubjectServiceT,
  SubjectT,
  SubjectUpdateParamsT,
} from "./subject.types";

class SubjectService implements SubjectServiceT {
  async list(params?: SubjectListParamsT): Promise<PaginatedResult<SubjectT>> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SubjectT>>>(
        `${SUBJECT_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: SubjectGetParamsT): Promise<SubjectT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectT>>(
        SUBJECT_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(params: SubjectCreateParamsT): Promise<SubjectT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectT>>(
        SUBJECT_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SubjectUpdateParamsT): Promise<SubjectT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SubjectT>>(
        SUBJECT_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: SubjectDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        SUBJECT_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectService = new SubjectService();
