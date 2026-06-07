import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedBlockComponentsResponse = <T>(response: PaginatedData<T>): T[] => response.results;
