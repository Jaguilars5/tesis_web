import type { PaginatedData } from "@shared/types/api.response.types";
export const mapPaginatedPromotionStatusesResponse = <T>(response: PaginatedData<T>): T[] => response.results;
