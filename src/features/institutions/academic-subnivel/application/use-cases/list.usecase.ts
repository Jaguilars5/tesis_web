import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";
import type { AcademicSubnivelListParamsT } from "../../domain/repositories/academic-subnivel.repository";
import { academicSubnivelApiRepository } from "../../infrastructure/repositories/academic-subnivel-api.repository";

export const listAcademicSubnivelsUseCase = async (
  params?: AcademicSubnivelListParamsT,
): Promise<AcademicSubnivelT[]> => {
  return academicSubnivelApiRepository.list(params);
};
