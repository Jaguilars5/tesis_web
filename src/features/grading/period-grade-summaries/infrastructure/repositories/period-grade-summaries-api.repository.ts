import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedPeriodGradeSummariesResponse } from "../mappers/period-grade-summaries.mapper";
import { PERIOD_GRADE_SUMMARIES_ENDPOINTS } from "../../constants/period-grade-summaries.constants";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";
import type {
  PeriodGradeSummaryListParamsT,
  PeriodGradeSummaryRepositoryT,
} from "../../domain/repositories/period-grade-summaries.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const periodGradeSummaryApiRepository: PeriodGradeSummaryRepositoryT = {
  async list(params?: PeriodGradeSummaryListParamsT): Promise<PeriodGradeSummaryT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<PeriodGradeSummaryT>>(
        `${PERIOD_GRADE_SUMMARIES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedPeriodGradeSummariesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<PeriodGradeSummaryT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PeriodGradeSummaryT>>(
        `${PERIOD_GRADE_SUMMARIES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<PeriodGradeSummaryT, "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at">): Promise<PeriodGradeSummaryT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PeriodGradeSummaryT>>(
        PERIOD_GRADE_SUMMARIES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<PeriodGradeSummaryT>): Promise<PeriodGradeSummaryT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PeriodGradeSummaryT>>(
        `${PERIOD_GRADE_SUMMARIES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<PeriodGradeSummaryT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PeriodGradeSummaryT>>(
        `${PERIOD_GRADE_SUMMARIES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
