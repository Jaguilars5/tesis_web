import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedSubjectProjectResponse = <T>(response: PaginatedData<T>): T[] => response.results;
