import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedSchoolYearResponse = <T>(response: PaginatedData<T>): T[] => response.results;
