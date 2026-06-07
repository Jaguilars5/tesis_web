import type { PaginatedData } from "@shared/types/api.response.types";

export const mapPaginatedInterdisciplinaryProjectResponse = <T>(response: PaginatedData<T>): T[] => response.results;
