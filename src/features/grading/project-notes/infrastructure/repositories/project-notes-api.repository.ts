import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { mapPaginatedProjectNotesResponse } from "../mappers/project-notes.mapper";
import { PROJECT_NOTES_ENDPOINTS } from "../../constants/project-notes.constants";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";
import type {
  ProjectNoteListParamsT,
  ProjectNoteRepositoryT,
} from "../../domain/repositories/project-notes.repository";
import type { PaginatedResponseApi, ResponseApi } from "@shared/types/api.response.types";

export const projectNoteApiRepository: ProjectNoteRepositoryT = {
  async list(params?: ProjectNoteListParamsT): Promise<ProjectNoteT[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponseApi<ProjectNoteT>>(
        `${PROJECT_NOTES_ENDPOINTS.LIST}?page=${params?.page ?? 1}&page_size=${params?.pageSize ?? 20}`,
      );
      return mapPaginatedProjectNotesResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async get(id: number): Promise<ProjectNoteT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ProjectNoteT>>(
        `${PROJECT_NOTES_ENDPOINTS.LIST}${id}/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async create(body): Promise<ProjectNoteT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ProjectNoteT>>(
        PROJECT_NOTES_ENDPOINTS.LIST,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async update(id: number, body: Partial<ProjectNoteT>): Promise<ProjectNoteT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ProjectNoteT>>(
        `${PROJECT_NOTES_ENDPOINTS.LIST}${id}/`,
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  async softDelete(id: number): Promise<ProjectNoteT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ProjectNoteT>>(
        `${PROJECT_NOTES_ENDPOINTS.LIST}${id}/soft-delete/`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
