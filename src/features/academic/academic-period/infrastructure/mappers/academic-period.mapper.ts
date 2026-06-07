import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedAcademicPeriodResponse = <T>(response: PaginatedData<T>): T[] => response.results;
