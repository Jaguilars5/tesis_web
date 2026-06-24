export interface SimulateParamsT {
  attendance_rate: number;
  average_grade: number;
  failing_subjects_count: number;
  severe_incidents_count: number;
  mild_incidents_count: number;
  consecutive_absences_max?: number;
  tardiness_count?: number;
  justified_absences?: number;
  unjustified_absences?: number;
  grade_trend_slope?: number;
  family_notified_ratio?: number;
  prev_period_avg_grade?: number;
  age_grade_gap?: number;
  is_repeat?: boolean;
  has_special_needs?: boolean;
  try_ml?: boolean;
}

export interface SemaforoRiesgoT {
  nivel: string;
  puntaje_riesgo: number;
  factores_criticos: string[];
  recomendaciones: string[];
}

export interface VariableDetailT {
  nivel: string;
  peso: number;
}

export interface SimulateRulesResultT {
  semaforo_riesgo: SemaforoRiesgoT;
  detalle_por_variable: Record<string, VariableDetailT>;
  model_version: string;
}

export interface SimulateMlSuccessT {
  puntaje_riesgo: number;
  model_version: string;
}

export interface SimulateMlErrorT {
  error: string;
}

export type SimulateMlResultT = SimulateMlSuccessT | SimulateMlErrorT | null;

export interface ConfigUsadaT {
  engine: string;
  preset: string;
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

export interface SimulateResponseT {
  reglas: SimulateRulesResultT;
  ml: SimulateMlResultT;
  config_usada: ConfigUsadaT;
}
