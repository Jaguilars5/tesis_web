import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";

import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { SUBJECT_OFFERING_ENDPOINTS } from "./subject-offering.constants";
import type {
  SubjectOfferingCreateParamsT,
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
      const filtersQuery = params?.filters
        ? `&${Object.entries(params.filters)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(
              ([key, value]) => `${key}=${encodeURIComponent(String(value))}`,
            )
            .join("&")}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<SubjectOfferingT>>
      >(
        `${SUBJECT_OFFERING_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: SubjectOfferingGetParamsT): Promise<SubjectOfferingT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    params: SubjectOfferingCreateParamsT,
  ): Promise<SubjectOfferingT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.CREATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(
    params: SubjectOfferingUpdateParamsT,
  ): Promise<SubjectOfferingT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: SubjectOfferingDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        SUBJECT_OFFERING_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectOfferingService = new SubjectOfferingService();
