import type { SectionT } from "../../domain/entities/section.types";
import type { SectionListParamsT } from "../../domain/repositories/section.repository";
import { sectionApiRepository } from "../../infrastructure/repositories/section-api.repository";

export const listSectionsUseCase = async (
  params?: SectionListParamsT,
): Promise<SectionT[]> => {
  return sectionApiRepository.list(params);
};
