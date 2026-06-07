import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedStudentNotesResponse } from "../mappers/student-notes.mapper";
import { STUDENT_NOTES_ENDPOINTS } from "../../constants/student-notes.constants";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";
import type {
  StudentNoteListParamsT,
  StudentNoteRepositoryT,
} from "../../domain/repositories/student-notes.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const studentNoteApiRepository: StudentNoteRepositoryT = {
  async list(params?: StudentNoteListParamsT): Promise<StudentNoteT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<StudentNoteT>>(
        `${STUDENT_NOTES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedStudentNotesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<StudentNoteT> {
    try {
      const { data } = await apiClient.get<ResponseApi<StudentNoteT>>(
        `${STUDENT_NOTES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body): Promise<StudentNoteT> {
    try {
      const { data } = await apiClient.post<ResponseApi<StudentNoteT>>(
        STUDENT_NOTES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<StudentNoteT>): Promise<StudentNoteT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<StudentNoteT>>(
        `${STUDENT_NOTES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<StudentNoteT> {
    try {
      const { data } = await apiClient.post<ResponseApi<StudentNoteT>>(
        `${STUDENT_NOTES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
