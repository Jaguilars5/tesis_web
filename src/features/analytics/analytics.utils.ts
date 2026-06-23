import type { RiskLabelT } from "./analytics.types";

export const RISK_LABEL_CONFIG: Record<RiskLabelT, { label: string; color: string; badgeVariant: "destructive" | "secondary" | "default" }> = {
  rojo: { label: "Alto Riesgo", color: "text-red-700 bg-red-50 border-red-200", badgeVariant: "destructive" },
  amarillo: { label: "Riesgo Moderado", color: "text-yellow-700 bg-yellow-50 border-yellow-200", badgeVariant: "secondary" },
  verde: { label: "Bajo Riesgo", color: "text-green-700 bg-green-50 border-green-200", badgeVariant: "default" },
};

export const RISK_BAR_COLORS: Record<RiskLabelT, string> = {
  rojo: "bg-red-500",
  amarillo: "bg-yellow-500",
  verde: "bg-green-500",
};

export function formatRiskScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getModelVersionLabel(version: string): string {
  if (version.includes("sklearn")) return "ML (GradientBoosting)";
  if (version.includes("rules-fallback")) return "Reglas + Fórmula";
  return version;
}

export function getRiskLevelDescription(label: RiskLabelT): string {
  switch (label) {
    case "rojo":
      return "El estudiante presenta múltiples factores críticos que requieren intervención inmediata.";
    case "amarillo":
      return "El estudiante muestra indicadores de alerta que requieren monitoreo y acciones preventivas.";
    case "verde":
      return "El estudiante se encuentra dentro de los parámetros esperados de rendimiento y asistencia.";
  }
}
