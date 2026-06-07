import type { SectionT } from "../../domain/entities/section.types";

export const formatSectionParallel = (item: SectionT): string => item.parallel;

export const formatCapacity = (item: SectionT): string =>
  `${item.capacity} estudiantes`;
