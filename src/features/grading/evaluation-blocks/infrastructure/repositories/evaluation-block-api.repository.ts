import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { EVALUATION_BLOCKS_ENDPOINTS } from "../../constants/evaluation-block.constants";
import type { EvaluationBlockRepositoryT } from "../../domain/repositories/evaluation-block.repository";
import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";

export const evaluationBlockApiRepository: EvaluationBlockRepositoryT = {
  async list() {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationBlockT[]>>(
        EVALUATION_BLOCKS_ENDPOINTS.LIST,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.GET,
        { id },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload: Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name">) {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.ADD,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<EvaluationBlockT>) {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.UPDATE,
        { id, ...payload },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.DELETE,
        { id },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
