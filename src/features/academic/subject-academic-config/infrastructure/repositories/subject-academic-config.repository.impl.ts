import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { SubjectAcademicConfigRepositoryT } from "../../domain/repositories/subject-academic-config.repository";
import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";
import { SUBJECT_ACADEMIC_CONFIG_ENDPOINTS } from "../../constants/subject-academic-config.constants";
import { mapToDomain } from "../mappers/subject-academic-config.mapper";

export class SubjectAcademicConfigRepositoryImpl implements SubjectAcademicConfigRepositoryT {
  async list(params?: { page?: number; pageSize?: number }): Promise<SubjectAcademicConfigT[]> {
    try {
      const { data } = await apiClient.get(
        `${SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return data.data.results.map(mapToDomain);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: number): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.get(
        `${SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST}${id}/`,
      );
      return mapToDomain(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    payload: Omit<SubjectAcademicConfigT, "id" | "is_active" | "subject_name" | "academic_grade_name">,
  ): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.post(
        SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST,
        payload,
      );
      return mapToDomain(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(id: number, payload: Partial<SubjectAcademicConfigT>): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.patch(
        `${SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return mapToDomain(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: number): Promise<SubjectAcademicConfigT> {
    try {
      const { data } = await apiClient.post(
        `${SUBJECT_ACADEMIC_CONFIG_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return mapToDomain(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectAcademicConfigRepository = new SubjectAcademicConfigRepositoryImpl();
