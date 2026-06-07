import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";
import { academicGradeApiRepository } from "../../infrastructure/repositories/academic-grade-api.repository";

export const softDeleteAcademicGradeUseCase = async (id: number): Promise<AcademicGradeT> => {
  return academicGradeApiRepository.softDelete(id);
};
