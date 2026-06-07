import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";

export const formatAcademicPeriodName = (item: AcademicPeriodT): string => item.name;

export const formatAcademicPeriodDateRange = (item: AcademicPeriodT): string =>
  `${item.start_date} - ${item.end_date}`;
