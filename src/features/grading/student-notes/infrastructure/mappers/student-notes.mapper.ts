import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedStudentNotesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
