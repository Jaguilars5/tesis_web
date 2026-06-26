import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { EVALUATION_BLOCKS_ENDPOINTS } from "./evaluation-blocks.constants";
import type {
  EvaluationBlockCreateParamsT,
  EvaluationBlockDeleteParamsT,
  EvaluationBlockGetParamsT,
  EvaluationBlockListParamsT,
  EvaluationBlockServiceT,
  EvaluationBlockT,
  EvaluationBlockUpdateParamsT,
} from "./evaluation-blocks.types";

class EvaluationBlockService implements EvaluationBlockServiceT {
  async list(params?: EvaluationBlockListParamsT): Promise<EvaluationBlockT[]> {
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
        ResponseApi<PaginatedData<EvaluationBlockT>>
      >(
        `${EVALUATION_BLOCKS_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: EvaluationBlockGetParamsT): Promise<EvaluationBlockT> {
    try {
      const { data } = await apiClient.get<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: EvaluationBlockCreateParamsT): Promise<EvaluationBlockT> {
    try {
      const { data } = await apiClient.post<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: EvaluationBlockUpdateParamsT): Promise<EvaluationBlockT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<EvaluationBlockT>>(
        EVALUATION_BLOCKS_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: EvaluationBlockDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(EVALUATION_BLOCKS_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const evaluationBlockService = new EvaluationBlockService();
