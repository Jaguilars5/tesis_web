import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";

export const formatAcademicGradeName = (item: AcademicGradeT): string => item.name;

export const formatAcademicLevelName = (item: AcademicGradeT): string =>
  item.academic_level_name ?? "-";
