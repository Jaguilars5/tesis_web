import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { GRADE_HISTORY_ENDPOINTS } from "./grade-history.constants";
import type {
  GradeChangeHistoryGetParamsT,
  GradeChangeHistoryListParamsT,
  GradeChangeHistoryT,
  GradeHistoryServiceT,
} from "./grade-history.types";

class GradeHistoryService implements GradeHistoryServiceT {
  async list(params?: GradeChangeHistoryListParamsT): Promise<GradeChangeHistoryT[]> {
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
        ResponseApi<PaginatedData<GradeChangeHistoryT>>
      >(
        `${GRADE_HISTORY_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: GradeChangeHistoryGetParamsT): Promise<GradeChangeHistoryT> {
    try {
      const { data } = await apiClient.get<ResponseApi<GradeChangeHistoryT>>(
        GRADE_HISTORY_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const gradeHistoryService = new GradeHistoryService();
