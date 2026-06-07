import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedGradeResponse = <T>(response: PaginatedData<T>): T[] => response.results;
