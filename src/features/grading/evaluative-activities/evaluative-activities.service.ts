import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { EVALUATIVE_ACTIVITY_ENDPOINTS } from "./evaluative-activities.constants";
import type {
  EvaluativeActivityCreateParamsT,
  EvaluativeActivityDeleteParamsT,
  EvaluativeActivityGetParamsT,
  EvaluativeActivityListParamsT,
  EvaluativeActivityServiceT,
  EvaluativeActivityT,
  EvaluativeActivityUpdateParamsT,
} from "./evaluative-activities.types";

class EvaluativeActivityService implements EvaluativeActivityServiceT {
  async list(
    params?: EvaluativeActivityListParamsT,
  ): Promise<EvaluativeActivityT[]> {
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
        ResponseApi<PaginatedData<EvaluativeActivityT>>
      >(
        `${EVALUATIVE_ACTIVITY_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(
    params: EvaluativeActivityGetParamsT,
  ): Promise<EvaluativeActivityT> {
    try {
      const { data } = await apiClient.get<ResponseApi<EvaluativeActivityT>>(
        EVALUATIVE_ACTIVITY_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    payload: EvaluativeActivityCreateParamsT,
  ): Promise<EvaluativeActivityT> {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluativeActivityT>>(
        EVALUATIVE_ACTIVITY_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(
    params: EvaluativeActivityUpdateParamsT,
  ): Promise<EvaluativeActivityT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<EvaluativeActivityT>>(
        EVALUATIVE_ACTIVITY_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: EvaluativeActivityDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        EVALUATIVE_ACTIVITY_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const evaluativeActivityService = new EvaluativeActivityService();
