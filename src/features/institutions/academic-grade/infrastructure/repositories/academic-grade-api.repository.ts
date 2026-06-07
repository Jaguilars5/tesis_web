import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import { ACADEMIC_GRADE_ENDPOINTS } from "../../domain/constants/academic-grade.constants";
import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";
import type {
  AcademicGradeListParamsT,
  AcademicGradeRepositoryT,
} from "../../domain/repositories/academic-grade.repository";
import { mapPaginatedGradeResponse } from "../mappers/academic-grade.mapper";

export const academicGradeApiRepository: AcademicGradeRepositoryT = {
  async list(params?: AcademicGradeListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<AcademicGradeT>>
      >(`${ACADEMIC_GRADE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`);
      return mapPaginatedGradeResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<AcademicGradeT>>(
        `${ACADEMIC_GRADE_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(
    payload: Omit<AcademicGradeT, "id" | "is_active" | "academic_level_name">,
  ) {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicGradeT>>(
        ACADEMIC_GRADE_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<AcademicGradeT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<AcademicGradeT>>(
        `${ACADEMIC_GRADE_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<AcademicGradeT>>(
        `${ACADEMIC_GRADE_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
