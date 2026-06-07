import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedActivityTypesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
