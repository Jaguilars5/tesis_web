import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedSectionResponse = <T>(response: PaginatedData<T>): T[] => response.results;
