import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedData = <T>(response: PaginatedData<T>): T[] => response.results;
