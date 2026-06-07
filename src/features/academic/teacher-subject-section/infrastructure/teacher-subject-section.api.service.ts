import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { TEACHER_SUBJECT_SECTION_ENDPOINTS } from "../constants/teacher-subject-section.constants";
import type { TeacherSubjectSectionRepositoryT } from "../domain/teacher-subject-section.repository";
import type { TeacherSubjectSectionT } from "../domain/teacher-subject-section.entity";

export class TeacherSubjectSectionApiService implements TeacherSubjectSectionRepositoryT {
  async list(params?: { page?: number; pageSize?: number }): Promise<TeacherSubjectSectionT[]> {
    try {
      const { data } = await apiClient.get<{ ok: boolean; data: { results: TeacherSubjectSectionT[] } }>(
        `${TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: number): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.get<{ ok: boolean; data: TeacherSubjectSectionT }>(
        `${TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: Omit<TeacherSubjectSectionT, "id" | "is_active" | "user_name" | "subject_offering_name">): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.post<{ ok: boolean; data: TeacherSubjectSectionT }>(
        TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST,
        { teacher_subject_section: payload },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(id: number, payload: Partial<TeacherSubjectSectionT>): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.put<{ ok: boolean; data: TeacherSubjectSectionT }>(
        `${TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST}${id}/`,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: number): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.put<{ ok: boolean; data: TeacherSubjectSectionT }>(
        `${TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const teacherSubjectSectionApiService = new TeacherSubjectSectionApiService();
