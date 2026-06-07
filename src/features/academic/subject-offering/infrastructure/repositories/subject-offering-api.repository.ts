import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { SUBJECT_OFFERING_ENDPOINTS } from "../../constants/subject-offering.constants";
import type { SubjectOfferingListParamsT, SubjectOfferingRepositoryT } from "../../domain/repositories/subject-offering.repository";
import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";
import { mapPaginatedSubjectOfferingResponse } from "../mappers/subject-offering.mapper";

export const subjectOfferingApiRepository: SubjectOfferingRepositoryT = {
  async list(params?: SubjectOfferingListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SubjectOfferingT>>>(
        `${SUBJECT_OFFERING_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedSubjectOfferingResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectOfferingT>>(
        `${SUBJECT_OFFERING_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload: Omit<SubjectOfferingT, "id" | "is_active" | "school_year_name" | "section_name" | "subject_academic_config_name">) {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectOfferingT>>(
        SUBJECT_OFFERING_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, payload: Partial<SubjectOfferingT>) {
    try {
      const { data } = await apiClient.patch<ResponseApi<SubjectOfferingT>>(
        `${SUBJECT_OFFERING_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number) {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectOfferingT>>(
        `${SUBJECT_OFFERING_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
