import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";
import { academicSubnivelApiRepository } from "../../infrastructure/repositories/academic-subnivel-api.repository";

export const createAcademicSubnivelUseCase = async (
  data: Omit<AcademicSubnivelT, "id" | "is_active" | "academic_level_name">,
): Promise<AcademicSubnivelT> => {
  return academicSubnivelApiRepository.create(data);
};
