import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedEvaluationBlockResponse = <T>(response: PaginatedData<T>): T[] => response.results;
