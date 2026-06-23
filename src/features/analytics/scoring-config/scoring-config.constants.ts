export const SCORING_CONFIG_ENDPOINTS = {
  GET: "/api/analytics/scoring-config/",
  UPDATE: "/api/analytics/scoring-config/update_config/",
  APPLY_PRESET: "/api/analytics/scoring-config/apply_preset/",
} as const;

export const SCORING_CONFIG_PERMISSIONS = {
  VIEW: "analytics.view_scoring_config",
  UPDATE: "analytics.update_scoring_config",
} as const;

// Rangos seguros (deben coincidir con la validación del backend, Auditoría §9.4).
export const WEIGHT_MIN = 10;
export const WEIGHT_MAX = 60;
export const WEIGHT_SUM = 100;

export const ENGINE_OPTIONS: { value: "reglas" | "ML"; label: string }[] = [
  { value: "reglas", label: "Motor de reglas (ponderado + umbrales)" },
  { value: "ML", label: "Modelo de Machine Learning" },
];

export const PRESET_OPTIONS: {
  value: "conservador" | "equilibrado" | "estricto";
  label: string;
  description: string;
}[] = [
  {
    value: "conservador",
    label: "Conservador",
    description: "Más sensible: clasifica en riesgo antes (umbrales más altos).",
  },
  {
    value: "equilibrado",
    label: "Equilibrado",
    description: "Valores por defecto del sistema.",
  },
  {
    value: "estricto",
    label: "Estricto",
    description: "Menos sensible: sólo casos extremos en rojo (umbrales más bajos).",
  },
];
