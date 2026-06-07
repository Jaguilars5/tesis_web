import type { SectionT } from "../../domain/entities/section.types";
import { sectionApiRepository } from "../../infrastructure/repositories/section-api.repository";

export const updateSectionUseCase = async (
  id: number,
  data: Partial<SectionT>,
): Promise<SectionT> => {
  return sectionApiRepository.update(id, data);
};
