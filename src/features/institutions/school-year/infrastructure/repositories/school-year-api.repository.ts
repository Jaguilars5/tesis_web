import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { SCHOOL_YEAR_ENDPOINTS } from "../../constants/school-year.constants";
import type { SchoolYearListParamsT, SchoolYearRepositoryT } from "../../domain/repositories/school-year.repository";
import type { SchoolYearT } from "../../domain/entities/school-year.types";
import { mapPaginatedSchoolYearResponse } from "../mappers/school-year.mapper";

export const schoolYearApiRepository: SchoolYearRepositoryT = {
  async list(params?: SchoolYearListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SchoolYearT>>>(
        `${SCHOOL_YEAR_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedSchoolYearResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<SchoolYearT>>(
        `${SCHOOL_YEAR_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload: Omit<SchoolYearT, "id" | "is_active">) {
    try {
      const { data } = await apiClient.post<ResponseApi<SchoolYearT>>(
        SCHOOL_YEAR_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<SchoolYearT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<SchoolYearT>>(
        `${SCHOOL_YEAR_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<SchoolYearT>>(
        `${SCHOOL_YEAR_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
