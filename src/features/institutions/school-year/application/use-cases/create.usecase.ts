import type { SchoolYearT } from "../../domain/entities/school-year.types";
import { schoolYearApiRepository } from "../../infrastructure/repositories/school-year-api.repository";

export const createSchoolYearUseCase = async (
  data: Omit<SchoolYearT, "id" | "is_active">,
): Promise<SchoolYearT> => {
  return schoolYearApiRepository.create(data);
};
