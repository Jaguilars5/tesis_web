import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedBlockComponentsResponse } from "../mappers/block-components.mapper";
import { BLOCK_COMPONENTS_ENDPOINTS } from "../../constants/block-components.constants";
import type { BlockComponentT } from "../../domain/entities/block-components.types";
import type {
  BlockComponentListParamsT,
  BlockComponentRepositoryT,
} from "../../domain/repositories/block-components.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const blockComponentApiRepository: BlockComponentRepositoryT = {
  async list(params?: BlockComponentListParamsT): Promise<BlockComponentT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<BlockComponentT>>(
        `${BLOCK_COMPONENTS_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedBlockComponentsResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.get<ResponseApi<BlockComponentT>>(
        `${BLOCK_COMPONENTS_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<BlockComponentT, "id" | "evaluation_block_name">): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.post<ResponseApi<BlockComponentT>>(
        BLOCK_COMPONENTS_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<BlockComponentT>): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<BlockComponentT>>(
        `${BLOCK_COMPONENTS_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.post<ResponseApi<BlockComponentT>>(
        `${BLOCK_COMPONENTS_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
