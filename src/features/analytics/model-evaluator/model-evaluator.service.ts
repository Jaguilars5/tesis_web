import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { MODEL_EVALUATOR_ENDPOINTS } from "./model-evaluator.constants";
import type { SimulateParamsT, SimulateResponseT } from "./model-evaluator.types";

class ModelEvaluatorService {
  async simulate(params: SimulateParamsT): Promise<SimulateResponseT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SimulateResponseT>>(
        MODEL_EVALUATOR_ENDPOINTS.SIMULATE,
        params,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const modelEvaluatorService = new ModelEvaluatorService();
