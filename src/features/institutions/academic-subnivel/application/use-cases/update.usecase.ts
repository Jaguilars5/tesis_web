import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";
import { academicSubnivelApiRepository } from "../../infrastructure/repositories/academic-subnivel-api.repository";

export const updateAcademicSubnivelUseCase = async (
  id: number,
  data: Partial<AcademicSubnivelT>,
): Promise<AcademicSubnivelT> => {
  return academicSubnivelApiRepository.update(id, data);
};
