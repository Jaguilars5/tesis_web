import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedPromotionStatusesResponse } from "../mappers/promotion-statuses.mapper";
import { PROMOTION_STATUSES_ENDPOINTS } from "../../constants/promotion-statuses.constants";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";
import type {
  PromotionStatusListParamsT,
  PromotionStatusRepositoryT,
} from "../../domain/repositories/promotion-statuses.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const promotionStatusApiRepository: PromotionStatusRepositoryT = {
  async list(params?: PromotionStatusListParamsT): Promise<PromotionStatusT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<PromotionStatusT>>(
        `${PROMOTION_STATUSES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedPromotionStatusesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<PromotionStatusT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PromotionStatusT>>(
        `${PROMOTION_STATUSES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<PromotionStatusT, "id" | "is_active" | "created_at" | "updated_at">): Promise<PromotionStatusT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PromotionStatusT>>(
        PROMOTION_STATUSES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<PromotionStatusT>): Promise<PromotionStatusT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PromotionStatusT>>(
        `${PROMOTION_STATUSES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<PromotionStatusT> {
    try {
      const { data } = await apiClient.post<ResponseApi<PromotionStatusT>>(
        `${PROMOTION_STATUSES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
