import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedComponentIndicatorsResponse = <T>(response: PaginatedData<T>): T[] => response.results;
