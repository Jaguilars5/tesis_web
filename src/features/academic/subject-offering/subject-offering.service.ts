import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";

import { SUBJECT_OFFERING_ENDPOINTS } from "./subject-offering.constants";
import type {
  SubjectOfferingCreateDataT,
  SubjectOfferingDeleteParamsT,
  SubjectOfferingGetParamsT,
  SubjectOfferingListParamsT,
  SubjectOfferingServiceT,
  SubjectOfferingT,
  SubjectOfferingUpdateParamsT,
} from "./subject-offering.types";

class SubjectOfferingService implements SubjectOfferingServiceT {
  async list(params?: SubjectOfferingListParamsT): Promise<SubjectOfferingT[]> {
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
        ResponseApi<PaginatedData<SubjectOfferingT>>
      >(
        `${SUBJECT_OFFERING_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: SubjectOfferingGetParamsT): Promise<SubjectOfferingT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: SubjectOfferingCreateDataT): Promise<SubjectOfferingT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SubjectOfferingUpdateParamsT): Promise<SubjectOfferingT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: SubjectOfferingDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        SUBJECT_OFFERING_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectOfferingService = new SubjectOfferingService();
