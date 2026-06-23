import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import { SUBJECT_ENDPOINTS } from "./subject.constants";
import type {
  SubjectCreateDataT,
  SubjectDeleteParamsT,
  SubjectGetParamsT,
  SubjectListParamsT,
  SubjectServiceT,
  SubjectT,
  SubjectUpdateParamsT,
} from "./subject.types";

class SubjectService implements SubjectServiceT {
  async list(params?: SubjectListParamsT): Promise<SubjectT[]> {
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
        ResponseApi<PaginatedData<SubjectT>>
      >(
        `${SUBJECT_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: SubjectGetParamsT): Promise<SubjectT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectT>>(
        SUBJECT_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: SubjectCreateDataT): Promise<SubjectT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectT>>(
        SUBJECT_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SubjectUpdateParamsT): Promise<SubjectT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SubjectT>>(
        SUBJECT_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: SubjectDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        SUBJECT_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectService = new SubjectService();
