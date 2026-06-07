import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";
import { academicPeriodApiRepository } from "../../infrastructure/repositories/academic-period-api.repository";

export const getAcademicPeriodUseCase = async (id: number): Promise<AcademicPeriodT> => {
  return academicPeriodApiRepository.get(id);
};
