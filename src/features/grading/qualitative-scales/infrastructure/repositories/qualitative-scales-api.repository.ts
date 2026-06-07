import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedQualitativeScalesResponse } from "../mappers/qualitative-scales.mapper";
import { QUALITATIVE_SCALES_ENDPOINTS } from "../../constants/qualitative-scales.constants";
import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";
import type {
  QualitativeScaleListParamsT,
  QualitativeScaleRepositoryT,
} from "../../domain/repositories/qualitative-scales.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const qualitativeScaleApiRepository: QualitativeScaleRepositoryT = {
  async list(params?: QualitativeScaleListParamsT): Promise<QualitativeScaleT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<QualitativeScaleT>>(
        `${QUALITATIVE_SCALES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedQualitativeScalesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<QualitativeScaleT> {
    try {
      const { data } = await apiClient.get<ResponseApi<QualitativeScaleT>>(
        `${QUALITATIVE_SCALES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body: Omit<QualitativeScaleT, "id">): Promise<QualitativeScaleT> {
    try {
      const { data } = await apiClient.post<ResponseApi<QualitativeScaleT>>(
        QUALITATIVE_SCALES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<QualitativeScaleT>): Promise<QualitativeScaleT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<QualitativeScaleT>>(
        `${QUALITATIVE_SCALES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${QUALITATIVE_SCALES_ENDPOINTS.LIST}${id}/`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
