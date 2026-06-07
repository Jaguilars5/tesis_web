import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedQualitativeScalesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
