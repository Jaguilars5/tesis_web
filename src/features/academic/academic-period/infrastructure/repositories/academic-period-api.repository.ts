import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { ACADEMIC_PERIOD_ENDPOINTS } from "../../constants/academic-period.constants";
import type { AcademicPeriodListParamsT, AcademicPeriodRepositoryT } from "../../domain/repositories/academic-period.repository";
import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";
import { mapPaginatedAcademicPeriodResponse } from "../mappers/academic-period.mapper";

export const academicPeriodApiRepository: AcademicPeriodRepositoryT = {
  async list(params?: AcademicPeriodListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<AcademicPeriodT>>>(
        `${ACADEMIC_PERIOD_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedAcademicPeriodResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicPeriodT>>(
        `${ACADEMIC_PERIOD_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload: Omit<AcademicPeriodT, "id" | "is_active" | "school_year_name">) {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicPeriodT>>(
        ACADEMIC_PERIOD_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<AcademicPeriodT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicPeriodT>>(
        `${ACADEMIC_PERIOD_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicPeriodT>>(
        `${ACADEMIC_PERIOD_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
