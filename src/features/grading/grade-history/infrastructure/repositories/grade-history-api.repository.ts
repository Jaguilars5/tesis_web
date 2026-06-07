import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedGradeHistoryResponse } from "../mappers/grade-history.mapper";
import { GRADE_HISTORY_ENDPOINTS } from "../../constants/grade-history.constants";
import type { GradeChangeHistoryT } from "../../domain/entities/grade-history.types";
import type {
  GradeChangeHistoryListParamsT,
  GradeChangeHistoryRepositoryT,
} from "../../domain/repositories/grade-history.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const gradeHistoryApiRepository: GradeChangeHistoryRepositoryT = {
  async list(params?: GradeChangeHistoryListParamsT): Promise<GradeChangeHistoryT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<GradeChangeHistoryT>>(
        `${GRADE_HISTORY_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedGradeHistoryResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<GradeChangeHistoryT> {
    try {
      const { data } = await apiClient.get<ResponseApi<GradeChangeHistoryT>>(
        `${GRADE_HISTORY_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
