import type { SchoolYearT } from "../../domain/entities/school-year.types";
import { schoolYearApiRepository } from "../../infrastructure/repositories/school-year-api.repository";

export const getSchoolYearUseCase = async (id: number): Promise<SchoolYearT> => {
  return schoolYearApiRepository.get(id);
};
