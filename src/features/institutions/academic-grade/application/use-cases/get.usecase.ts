import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";
import { academicGradeApiRepository } from "../../infrastructure/repositories/academic-grade-api.repository";

export const getAcademicGradeUseCase = async (id: number): Promise<AcademicGradeT> => {
  return academicGradeApiRepository.get(id);
};
