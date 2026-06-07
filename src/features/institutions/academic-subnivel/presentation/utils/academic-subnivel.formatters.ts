import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";

export const formatSubnivelName = (item: AcademicSubnivelT): string =>
  `${item.code} - ${item.name}`;
