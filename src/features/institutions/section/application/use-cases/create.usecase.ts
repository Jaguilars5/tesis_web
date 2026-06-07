import type { SectionT } from "../../domain/entities/section.types";
import { sectionApiRepository } from "../../infrastructure/repositories/section-api.repository";

export const createSectionUseCase = async (
  data: Omit<SectionT, "id" | "is_active" | "school_year_name" | "academic_grade_name">,
): Promise<SectionT> => {
  return sectionApiRepository.create(data);
};
