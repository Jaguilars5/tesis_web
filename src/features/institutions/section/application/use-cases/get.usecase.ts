import type { SectionT } from "../../domain/entities/section.types";
import { sectionApiRepository } from "../../infrastructure/repositories/section-api.repository";

export const getSectionUseCase = async (id: number): Promise<SectionT> => {
  return sectionApiRepository.get(id);
};
