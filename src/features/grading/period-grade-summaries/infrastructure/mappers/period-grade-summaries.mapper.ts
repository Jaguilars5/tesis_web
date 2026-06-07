import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedPeriodGradeSummariesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
