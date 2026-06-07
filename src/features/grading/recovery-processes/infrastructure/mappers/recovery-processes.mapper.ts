import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedRecoveryProcessesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
