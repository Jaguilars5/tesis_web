import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { SUBJECT_PROJECT_ENDPOINTS } from "../../constants/subject-project.constants";
import type { SubjectProjectRepositoryT } from "../../domain/repositories/subject-project.repository";
import type { SubjectProjectT } from "../../domain/entities/subject-project.types";
import { mapPaginatedSubjectProjectResponse } from "../mappers/subject-project.mapper";

export const subjectProjectApiRepository: SubjectProjectRepositoryT = {
  async list(params) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SubjectProjectT>>>(
        `${SUBJECT_PROJECT_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedSubjectProjectResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number) {
    try {
      const { data } = await apiClient.get<ResponseApi<SubjectProjectT>>(
        `${SUBJECT_PROJECT_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post<ResponseApi<SubjectProjectT>>(
        SUBJECT_PROJECT_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async delete(id: number) {
    try {
      await apiClient.delete<ResponseApi<void>>(
        `${SUBJECT_PROJECT_ENDPOINTS.LIST}${id}/`,
      );
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
