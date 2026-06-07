import type { PeriodTypeEnum } from "../entities/academic-period.types";

export const validateAcademicPeriodName = (name: string): string | null => {
  if (!name.trim()) return "El nombre es obligatorio";
  if (name.length < 1) return "El nombre debe tener al menos 1 caracter";
  if (name.length > 80) return "El nombre no debe exceder 80 caracteres";
  return null;
};

export const validatePeriodType = (periodType: string): periodType is PeriodTypeEnum => {
  return ["REGULAR", "SUPLETORIO", "REFUERZO"].includes(periodType);
};
