import type { SchoolYearT } from "../../domain/entities/school-year.types";
import type { SchoolYearListParamsT } from "../../domain/repositories/school-year.repository";
import { schoolYearApiRepository } from "../../infrastructure/repositories/school-year-api.repository";

export const listSchoolYearsUseCase = async (
  params?: SchoolYearListParamsT,
): Promise<SchoolYearT[]> => {
  return schoolYearApiRepository.list(params);
};
