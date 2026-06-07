import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { SubjectT } from "../../domain/entities/subject.types";
import type {
  SubjectListParamsT,
  SubjectRepositoryT,
} from "../../domain/repositories/subject.repository";
import type {
  PaginatedResponseApi,
  ResponseApi,
} from "@shared/types/api.response.types";
import { mapPaginatedSubjectResponse } from "../mappers/subject.mapper";

interface ApiSubject {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export class SubjectApiRepository implements SubjectRepositoryT {
  private endpoint = "/api/academic/subject";

  async list(params?: SubjectListParamsT): Promise<SubjectT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const { data } = await apiClient.get<PaginatedResponseApi<ApiSubject>>(
        `${this.endpoint}/?page=${page}&page_size=${pageSize}`,
      );
      return mapPaginatedSubjectResponse(data.data).results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: number): Promise<SubjectT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ApiSubject>>(
        `${this.endpoint}/${id}/`,
      );
      return {
        id: data.data.id,
        name: data.data.name,
        code: data.data.code,
        is_active: data.data.active,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    payload: Omit<SubjectT, "id" | "is_active">,
  ): Promise<SubjectT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ApiSubject>>(
        `${this.endpoint}/`,
        { name: payload.name, code: payload.code },
      );
      return {
        id: data.data.id,
        name: data.data.name,
        code: data.data.code,
        is_active: data.data.active,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(id: number, payload: Partial<SubjectT>): Promise<SubjectT> {
    try {
      const body: Record<string, unknown> = {};
      if (payload.name !== undefined) body.name = payload.name;
      if (payload.code !== undefined) body.code = payload.code;
      if (payload.is_active !== undefined) body.active = payload.is_active;
      const { data } = await apiClient.patch<ResponseApi<ApiSubject>>(
        `${this.endpoint}/${id}/`,
        body,
      );
      return {
        id: data.data.id,
        name: data.data.name,
        code: data.data.code,
        is_active: data.data.active,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: number): Promise<SubjectT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ApiSubject>>(
        `${this.endpoint}/${id}/soft-delete/`,
      );
      return {
        id: data.data.id,
        name: data.data.name,
        code: data.data.code,
        is_active: data.data.active,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const subjectApiRepository = new SubjectApiRepository();
