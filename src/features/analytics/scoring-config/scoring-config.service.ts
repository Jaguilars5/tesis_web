import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";

import { SCORING_CONFIG_ENDPOINTS } from "./scoring-config.constants";
import type {
  RiskScoringConfigT,
  ScoringConfigServiceT,
  ScoringConfigUpdateDataT,
  ScoringPresetT,
} from "./scoring-config.types";

// DRF serializa DecimalField como string (COERCE_DECIMAL_TO_STRING); normalizamos
// los campos numéricos a `number` para el formulario y los cálculos del front.
const NUMERIC_FIELDS: (keyof RiskScoringConfigT)[] = [
  "weight_conducta",
  "weight_asistencia",
  "weight_calificaciones",
  "attendance_red_max",
  "attendance_yellow_max",
  "average_red_max",
  "average_yellow_max",
  "severe_red_min",
  "mild_yellow_min",
];

const normalize = (raw: RiskScoringConfigT): RiskScoringConfigT => {
  const result = { ...raw } as Record<string, unknown>;
  for (const field of NUMERIC_FIELDS) {
    result[field] = Number(raw[field]);
  }
  return result as unknown as RiskScoringConfigT;
};

class ScoringConfigService implements ScoringConfigServiceT {
  async get(): Promise<RiskScoringConfigT> {
    try {
      const { data } = await apiClient.get<ResponseApi<RiskScoringConfigT>>(
        SCORING_CONFIG_ENDPOINTS.GET,
      );
      return normalize(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(data: ScoringConfigUpdateDataT): Promise<RiskScoringConfigT> {
    try {
      const { data: res } = await apiClient.patch<
        ResponseApi<RiskScoringConfigT>
      >(SCORING_CONFIG_ENDPOINTS.UPDATE, data);
      return normalize(res.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async applyPreset(preset: ScoringPresetT): Promise<RiskScoringConfigT> {
    try {
      const { data } = await apiClient.post<ResponseApi<RiskScoringConfigT>>(
        SCORING_CONFIG_ENDPOINTS.APPLY_PRESET,
        { preset },
      );
      return normalize(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const scoringConfigService = new ScoringConfigService();
