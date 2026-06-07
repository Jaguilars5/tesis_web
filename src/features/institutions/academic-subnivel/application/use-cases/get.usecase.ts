import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";
import { academicSubnivelApiRepository } from "../../infrastructure/repositories/academic-subnivel-api.repository";

export const getAcademicSubnivelUseCase = async (id: number): Promise<AcademicSubnivelT> => {
  return academicSubnivelApiRepository.get(id);
};
