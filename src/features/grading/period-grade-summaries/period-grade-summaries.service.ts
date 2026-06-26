import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { PERIOD_GRADE_SUMMARIES_ENDPOINTS } from "./period-grade-summaries.constants";
import type {
  PeriodGradeSummaryCreateDataT,
  PeriodGradeSummaryDeleteParamsT,
  PeriodGradeSummaryGetParamsT,
  PeriodGradeSummaryListParamsT,
  PeriodGradeSummaryServiceT,
  PeriodGradeSummaryT,
  PeriodGradeSummaryUpdateParamsT,
} from "./period-grade-summaries.types";

class PeriodGradeSummaryService implements PeriodGradeSummaryServiceT {
  async list(params?: PeriodGradeSummaryListParamsT): Promise<PeriodGradeSummaryT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
      const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
      const filters = params?.filters ?? {};
      const filtersQuery = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `&${key}=${encodeURIComponent(String(value))}`)
        .join("");
      const { data } = await apiClient.get<ResponseApi<PaginatedData<PeriodGradeSummaryT>>>(
        `${PERIOD_GRADE_SUMMARIES_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: PeriodGradeSummaryGetParamsT): Promise<PeriodGradeSummaryT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PeriodGradeSummaryT>>(
        PERIOD_GRADE_SUMMARIES_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: PeriodGradeSummaryCreateDataT): Promise<PeriodGradeSummaryT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<PeriodGradeSummaryT>>(
        PERIOD_GRADE_SUMMARIES_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: PeriodGradeSummaryUpdateParamsT): Promise<PeriodGradeSummaryT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PeriodGradeSummaryT>>(
        PERIOD_GRADE_SUMMARIES_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: PeriodGradeSummaryDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        PERIOD_GRADE_SUMMARIES_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const periodGradeSummaryService = new PeriodGradeSummaryService();
