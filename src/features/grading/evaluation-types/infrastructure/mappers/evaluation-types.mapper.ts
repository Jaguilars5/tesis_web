import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedEvaluationTypesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
