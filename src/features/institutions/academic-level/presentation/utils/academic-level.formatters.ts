import type { AcademicLevelT } from "../../domain/entities/academic-level.types";

export function formatAcademicLevelStatus(academicLevel: AcademicLevelT): string {
  return academicLevel.is_active ? "Activo" : "Inactivo";
}
