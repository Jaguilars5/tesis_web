import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { STUDENT_NOTES_ENDPOINTS } from "./student-notes.constants";
import type {
  StudentNoteCreateDataT,
  StudentNoteDeleteParamsT,
  StudentNoteGetParamsT,
  StudentNoteListParamsT,
  StudentNoteServiceT,
  StudentNoteT,
  StudentNoteUpdateParamsT,
} from "./student-notes.types";

class StudentNoteService implements StudentNoteServiceT {
  async list(params?: StudentNoteListParamsT): Promise<StudentNoteT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
      const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
      const filters = params?.filters ?? {};
      const filtersQuery = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `&${key}=${encodeURIComponent(String(value))}`)
        .join("");
      const { data } = await apiClient.get<ResponseApi<PaginatedData<StudentNoteT>>>(
        `${STUDENT_NOTES_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: StudentNoteGetParamsT): Promise<StudentNoteT> {
    try {
      const { data } = await apiClient.get<ResponseApi<StudentNoteT>>(
        STUDENT_NOTES_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: StudentNoteCreateDataT): Promise<StudentNoteT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<StudentNoteT>>(
        STUDENT_NOTES_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: StudentNoteUpdateParamsT): Promise<StudentNoteT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<StudentNoteT>>(
        STUDENT_NOTES_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: StudentNoteDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        STUDENT_NOTES_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const studentNoteService = new StudentNoteService();
