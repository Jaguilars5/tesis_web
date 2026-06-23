import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { BEHAVIOR_EVALUATION_ENDPOINTS } from "./behavior-evaluation.constants";
import type { BehaviorEvaluationCalculateDataT, BehaviorEvaluationListParamsT, BehaviorEvaluationGetParamsT, BehaviorEvaluationServiceT, BehaviorEvaluationT, BehaviorEvaluationUpdateParamsT } from "./behavior-evaluation.types";
import type { RelatedConductIncidentT } from "./behavior-evaluation.types";

class BehaviorEvaluationService implements BehaviorEvaluationServiceT {
  async list(params?: BehaviorEvaluationListParamsT): Promise<BehaviorEvaluationT[]> {
    try {
      const qs = new URLSearchParams();
      if (params?.page) qs.set("page", String(params.page));
      if (params?.pageSize) qs.set("page_size", String(params.pageSize));
      if (params?.search) qs.set("search", params.search);
      if (params?.ordering) qs.set("ordering", params.ordering);
      if (params?.enrollment) qs.set("enrollment", String(params.enrollment));
      if (params?.academic_period) qs.set("academic_period", String(params.academic_period));
      const query = qs.toString();
      const url = query ? `${BEHAVIOR_EVALUATION_ENDPOINTS.LIST}?${query}` : BEHAVIOR_EVALUATION_ENDPOINTS.LIST;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<BehaviorEvaluationT>>>(url);
      return data.data.results;
    } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async get(id: BehaviorEvaluationGetParamsT): Promise<BehaviorEvaluationT> {
    try { const { data } = await apiClient.get<ResponseApi<BehaviorEvaluationT>>(BEHAVIOR_EVALUATION_ENDPOINTS.DETAIL(id)); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async update(params: BehaviorEvaluationUpdateParamsT): Promise<BehaviorEvaluationT> {
    try { const { data } = await apiClient.patch<ResponseApi<BehaviorEvaluationT>>(BEHAVIOR_EVALUATION_ENDPOINTS.DETAIL(params.id), params.data); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async calculate(data: BehaviorEvaluationCalculateDataT): Promise<BehaviorEvaluationT> {
    try { const { data: res } = await apiClient.post<ResponseApi<BehaviorEvaluationT>>(BEHAVIOR_EVALUATION_ENDPOINTS.CALCULATE, { enrollment_id: data.enrollment_id, academic_period_id: data.academic_period_id }); return res.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async getRelatedIncidents(id: number): Promise<RelatedConductIncidentT[]> {
    try { const { data } = await apiClient.get<ResponseApi<RelatedConductIncidentT[]>>(BEHAVIOR_EVALUATION_ENDPOINTS.RELATED_INCIDENTS(id)); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
}

export const behaviorEvaluationService = new BehaviorEvaluationService();
