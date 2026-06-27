import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import { BEHAVIOR_EVALUATION_ENDPOINTS } from "./behavior-evaluation.constants";
import type {
  BehaviorEvaluationCalculateDataT,
  BehaviorEvaluationGetParamsT,
  BehaviorEvaluationGetRelatedIncidentsParamsT,
  BehaviorEvaluationListParamsT,
  BehaviorEvaluationServiceT,
  BehaviorEvaluationT,
  BehaviorEvaluationUpdateParamsT,
} from "./behavior-evaluation.types";
import type { RelatedConductIncidentT } from "./behavior-evaluation.types";

class BehaviorEvaluationService implements BehaviorEvaluationServiceT {
  async list(
    params?: BehaviorEvaluationListParamsT,
  ): Promise<PaginatedResult<BehaviorEvaluationT>> {
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
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join("&")}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<BehaviorEvaluationT>>
      >(
        `${BEHAVIOR_EVALUATION_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: BehaviorEvaluationGetParamsT): Promise<BehaviorEvaluationT> {
    try {
      const { data } = await apiClient.get<ResponseApi<BehaviorEvaluationT>>(
        BEHAVIOR_EVALUATION_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: BehaviorEvaluationUpdateParamsT): Promise<BehaviorEvaluationT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<BehaviorEvaluationT>>(
        BEHAVIOR_EVALUATION_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async calculate(data: BehaviorEvaluationCalculateDataT): Promise<BehaviorEvaluationT> {
    try {
      const { data: res } = await apiClient.post<ResponseApi<BehaviorEvaluationT>>(
        BEHAVIOR_EVALUATION_ENDPOINTS.CALCULATE,
        { enrollment_id: data.enrollment_id, academic_period_id: data.academic_period_id },
      );
      return res.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getRelatedIncidents(
    params: BehaviorEvaluationGetRelatedIncidentsParamsT,
  ): Promise<RelatedConductIncidentT[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<RelatedConductIncidentT[]>
      >(BEHAVIOR_EVALUATION_ENDPOINTS.RELATED_INCIDENTS(params.id));
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const behaviorEvaluationService = new BehaviorEvaluationService();
