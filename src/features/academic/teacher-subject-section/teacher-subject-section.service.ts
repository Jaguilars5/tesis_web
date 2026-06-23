import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";

import { TEACHER_SUBJECT_SECTION_ENDPOINTS } from "./teacher-subject-section.constants";
import type {
  TeacherSubjectSectionCreateDataT,
  TeacherSubjectSectionDeleteParamsT,
  TeacherSubjectSectionGetParamsT,
  TeacherSubjectSectionListParamsT,
  TeacherSubjectSectionServiceT,
  TeacherSubjectSectionT,
  TeacherSubjectSectionUpdateParamsT,
} from "./teacher-subject-section.types";

class TeacherSubjectSectionService implements TeacherSubjectSectionServiceT {
  async list(params?: TeacherSubjectSectionListParamsT): Promise<TeacherSubjectSectionT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const filters = params?.filters ?? {};
      const filterKeys = Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null,
      ) as [string, string | number | boolean][];
      const filterQuery = filterKeys
        .map(([key, value]) => `&${key}=${encodeURIComponent(String(value))}`)
        .join("");
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<TeacherSubjectSectionT>>
      >(
        `${TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filterQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: TeacherSubjectSectionGetParamsT): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.get<ResponseApi<TeacherSubjectSectionT>>(
        TEACHER_SUBJECT_SECTION_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: TeacherSubjectSectionCreateDataT): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.post<ResponseApi<TeacherSubjectSectionT>>(
        TEACHER_SUBJECT_SECTION_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: TeacherSubjectSectionUpdateParamsT): Promise<TeacherSubjectSectionT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<TeacherSubjectSectionT>>(
        TEACHER_SUBJECT_SECTION_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: TeacherSubjectSectionDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        TEACHER_SUBJECT_SECTION_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const teacherSubjectSectionService = new TeacherSubjectSectionService();
