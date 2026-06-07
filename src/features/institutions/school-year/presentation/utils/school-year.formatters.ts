import type { SchoolYearT } from "../../domain/entities/school-year.types";

export const formatSchoolYearName = (item: SchoolYearT): string => item.name;

export const formatDateRange = (item: SchoolYearT): string =>
  `${item.start_date} - ${item.end_date}`;
