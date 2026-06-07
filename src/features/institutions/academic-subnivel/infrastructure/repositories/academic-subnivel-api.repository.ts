import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { ACADEMIC_SUBNIVEL_ENDPOINTS } from "../../constants/academic-subnivel.constants";
import type { AcademicSubnivelListParamsT, AcademicSubnivelRepositoryT } from "../../domain/repositories/academic-subnivel.repository";
import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";
import { mapPaginatedData } from "../mappers/academic-subnivel.mapper";

export const academicSubnivelApiRepository: AcademicSubnivelRepositoryT = {
  async list(params?: AcademicSubnivelListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<AcademicSubnivelT>>>(
        `${ACADEMIC_SUBNIVEL_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedData(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicSubnivelT>>(
        `${ACADEMIC_SUBNIVEL_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload: Omit<AcademicSubnivelT, "id" | "is_active" | "academic_level_name">) {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicSubnivelT>>(
        ACADEMIC_SUBNIVEL_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<AcademicSubnivelT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicSubnivelT>>(
        `${ACADEMIC_SUBNIVEL_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicSubnivelT>>(
        `${ACADEMIC_SUBNIVEL_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
