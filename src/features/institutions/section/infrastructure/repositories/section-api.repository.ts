import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { SECTION_ENDPOINTS } from "../../constants/section.constants";
import type { SectionListParamsT, SectionRepositoryT } from "../../domain/repositories/section.repository";
import type { SectionT } from "../../domain/entities/section.types";
import { mapPaginatedSectionResponse } from "../mappers/section.mapper";

export const sectionApiRepository: SectionRepositoryT = {
  async list(params?: SectionListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SectionT>>>(
        `${SECTION_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedSectionResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<SectionT>>(
        `${SECTION_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload: Omit<SectionT, "id" | "is_active" | "school_year_name" | "academic_grade_name">) {
    try {
      const { data } = await apiClient.post<ResponseApi<SectionT>>(
        SECTION_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<SectionT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<SectionT>>(
        `${SECTION_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<SectionT>>(
        `${SECTION_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
