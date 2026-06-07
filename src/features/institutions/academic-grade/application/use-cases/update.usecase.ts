import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";
import { academicGradeApiRepository } from "../../infrastructure/repositories/academic-grade-api.repository";

export const updateAcademicGradeUseCase = async (
  id: number,
  data: Partial<AcademicGradeT>,
): Promise<AcademicGradeT> => {
  return academicGradeApiRepository.update(id, data);
};
