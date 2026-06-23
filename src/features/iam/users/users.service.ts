import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";

import { USER_ENDPOINTS } from "./users.constants";
import type {
  UserCreateDataT,
  UserDeleteParamsT,
  UserGetParamsT,
  UserListParamsT,
  UserServiceT,
  UserT,
  UserUpdateParamsT,
} from "./users.types";

class UserService implements UserServiceT {
  async list(params?: UserListParamsT): Promise<UserT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<UserT>>>(
        `${USER_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: UserGetParamsT): Promise<UserT> {
    try {
      const { data } = await apiClient.get<ResponseApi<UserT>>(
        USER_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: UserCreateDataT): Promise<UserT> {
    try {
      const { data } = await apiClient.post<ResponseApi<UserT>>(
        USER_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: UserUpdateParamsT): Promise<UserT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<UserT>>(
        USER_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: UserDeleteParamsT): Promise<{ id: number }> {
    try {
      await apiClient.delete<ResponseApi<{ id: number }>>(
        USER_ENDPOINTS.DETAIL(id),
      );
      return { id };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    try {
      await apiClient.post(USER_ENDPOINTS.CHANGE_PASSWORD(id), {
        new_password: newPassword,
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const userService = new UserService();
