import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";
import type { AcademicPeriodListParamsT } from "../../domain/repositories/academic-period.repository";
import { academicPeriodApiRepository } from "../../infrastructure/repositories/academic-period-api.repository";

export const listAcademicPeriodsUseCase = async (
  params?: AcademicPeriodListParamsT,
): Promise<AcademicPeriodT[]> => {
  return academicPeriodApiRepository.list(params);
};
