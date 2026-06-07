import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedGradeTypesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
