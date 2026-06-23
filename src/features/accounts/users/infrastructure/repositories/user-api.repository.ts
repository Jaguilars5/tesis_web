import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { USER_ENDPOINTS } from "../../constants/user.constants";
import type { UserT } from "../../domain/entities/user.types";
import type {
  UserListParamsT,
  UserRepositoryT,
} from "../../domain/repositories/user.repository";

export const userApiRepository: UserRepositoryT = {
  async list(params?: UserListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<{
          count: number;
          next: string | null;
          previous: string | null;
          results: UserT[];
        }>
      >(
        `${USER_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },
};
