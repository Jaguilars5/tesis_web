import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedPeriodTypeResponse = <T>(response: PaginatedData<T>): T[] => response.results;
