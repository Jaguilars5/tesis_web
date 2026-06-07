import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { INTERDISCIPLINARY_PROJECT_ENDPOINTS } from "../../constants/interdisciplinary-project.constants";
import type { InterdisciplinaryProjectRepositoryT } from "../../domain/repositories/interdisciplinary-project.repository";
import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";
import { mapPaginatedInterdisciplinaryProjectResponse } from "../mappers/interdisciplinary-project.mapper";

export const interdisciplinaryProjectApiRepository: InterdisciplinaryProjectRepositoryT = {
  async list(params) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<InterdisciplinaryProjectT>>>(
        `${INTERDISCIPLINARY_PROJECT_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedInterdisciplinaryProjectResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<InterdisciplinaryProjectT>>(
        `${INTERDISCIPLINARY_PROJECT_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post<ResponseApi<InterdisciplinaryProjectT>>(
        INTERDISCIPLINARY_PROJECT_ENDPOINTS.LIST,
        { interdisciplinary_project: payload },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<InterdisciplinaryProjectT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<InterdisciplinaryProjectT>>(
        `${INTERDISCIPLINARY_PROJECT_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<InterdisciplinaryProjectT>>(
        `${INTERDISCIPLINARY_PROJECT_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
