import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";
import { academicGradeApiRepository } from "../../infrastructure/repositories/academic-grade-api.repository";

export const createAcademicGradeUseCase = async (
  data: Omit<AcademicGradeT, "id" | "is_active" | "academic_level_name">,
): Promise<AcademicGradeT> => {
  return academicGradeApiRepository.create(data);
};
