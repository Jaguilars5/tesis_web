import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";
import type { AcademicGradeListParamsT } from "../../domain/repositories/academic-grade.repository";
import { academicGradeApiRepository } from "../../infrastructure/repositories/academic-grade-api.repository";

export const listAcademicGradesUseCase = async (
  params?: AcademicGradeListParamsT,
): Promise<AcademicGradeT[]> => {
  return academicGradeApiRepository.list(params);
};
