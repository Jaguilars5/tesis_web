import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedRecoveryProcessTypesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
