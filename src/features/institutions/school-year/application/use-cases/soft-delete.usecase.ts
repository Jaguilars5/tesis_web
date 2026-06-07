import type { SchoolYearT } from "../../domain/entities/school-year.types";
import { schoolYearApiRepository } from "../../infrastructure/repositories/school-year-api.repository";

export const softDeleteSchoolYearUseCase = async (id: number): Promise<SchoolYearT> => {
  return schoolYearApiRepository.softDelete(id);
};
