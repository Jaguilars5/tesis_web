import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";
import { academicPeriodApiRepository } from "../../infrastructure/repositories/academic-period-api.repository";

export const createAcademicPeriodUseCase = async (
  data: Omit<AcademicPeriodT, "id" | "is_active" | "school_year_name">,
): Promise<AcademicPeriodT> => {
  return academicPeriodApiRepository.create(data);
};
