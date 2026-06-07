import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedGradeHistoryResponse = <T>(response: PaginatedData<T>): T[] => response.results;
