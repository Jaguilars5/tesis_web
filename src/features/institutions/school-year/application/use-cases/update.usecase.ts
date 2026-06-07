import type { SchoolYearT } from "../../domain/entities/school-year.types";
import { schoolYearApiRepository } from "../../infrastructure/repositories/school-year-api.repository";

export const updateSchoolYearUseCase = async (
  id: number,
  data: Partial<SchoolYearT>,
): Promise<SchoolYearT> => {
  return schoolYearApiRepository.update(id, data);
};
