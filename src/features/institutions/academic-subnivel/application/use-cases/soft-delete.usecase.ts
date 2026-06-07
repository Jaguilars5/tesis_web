import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";
import { academicSubnivelApiRepository } from "../../infrastructure/repositories/academic-subnivel-api.repository";

export const softDeleteAcademicSubnivelUseCase = async (id: number): Promise<AcademicSubnivelT> => {
  return academicSubnivelApiRepository.softDelete(id);
};
