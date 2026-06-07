import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";
import { academicPeriodApiRepository } from "../../infrastructure/repositories/academic-period-api.repository";

export const updateAcademicPeriodUseCase = async (
  id: number,
  data: Partial<AcademicPeriodT>,
): Promise<AcademicPeriodT> => {
  return academicPeriodApiRepository.update(id, data);
};
