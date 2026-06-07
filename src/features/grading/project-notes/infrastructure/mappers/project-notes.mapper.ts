import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedProjectNotesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
