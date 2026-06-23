export type ScoringEngineT = "reglas" | "ML";

export type ScoringPresetT =
  | "conservador"
  | "equilibrado"
  | "estricto"
  | "personalizado";

export interface RiskScoringConfigT {
  id: number;
  engine: ScoringEngineT;
  preset: ScoringPresetT;
  weight_conducta: number;
  weight_asistencia: number;
  weight_calificaciones: number;
  attendance_red_max: number;
  attendance_yellow_max: number;
  average_red_max: number;
  average_yellow_max: number;
  severe_red_min: number;
  mild_yellow_min: number;
  created_at: string;
  updated_at: string;
}

export interface ScoringConfigFormValues {
  engine: ScoringEngineT;
  weight_conducta: number;
  weight_asistencia: number;
  weight_calificaciones: number;
  attendance_red_max: number;
  attendance_yellow_max: number;
  average_red_max: number;
  average_yellow_max: number;
  severe_red_min: number;
  mild_yellow_min: number;
}

export type ScoringConfigUpdateDataT = Partial<ScoringConfigFormValues> & {
  preset?: ScoringPresetT;
};

export interface ScoringConfigServiceT {
  get(): Promise<RiskScoringConfigT>;
  update(data: ScoringConfigUpdateDataT): Promise<RiskScoringConfigT>;
  applyPreset(preset: ScoringPresetT): Promise<RiskScoringConfigT>;
}
