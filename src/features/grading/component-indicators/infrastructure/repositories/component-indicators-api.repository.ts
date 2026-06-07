import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedComponentIndicatorsResponse } from "../mappers/component-indicators.mapper";
import { COMPONENT_INDICATORS_ENDPOINTS } from "../../constants/component-indicators.constants";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";
import type {
  ComponentIndicatorListParamsT,
  ComponentIndicatorRepositoryT,
} from "../../domain/repositories/component-indicators.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const componentIndicatorApiRepository: ComponentIndicatorRepositoryT = {
  async list(params?: ComponentIndicatorListParamsT): Promise<ComponentIndicatorT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<ComponentIndicatorT>>(
        `${COMPONENT_INDICATORS_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedComponentIndicatorsResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<ComponentIndicatorT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ComponentIndicatorT>>(
        `${COMPONENT_INDICATORS_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<ComponentIndicatorT, "id" | "block_component_name">): Promise<ComponentIndicatorT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ComponentIndicatorT>>(
        COMPONENT_INDICATORS_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<ComponentIndicatorT>): Promise<ComponentIndicatorT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ComponentIndicatorT>>(
        `${COMPONENT_INDICATORS_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<ComponentIndicatorT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ComponentIndicatorT>>(
        `${COMPONENT_INDICATORS_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
