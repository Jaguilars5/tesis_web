import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
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
      const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
      const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
      const filters = params?.filters ?? {};
      const filterQuery = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `&${key}=${encodeURIComponent(String(value))}`)
        .join("");
      const { data } = await apiClient.get<ResponseApi<PaginatedData<UserT>>>(
        `${USER_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filterQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: UserGetParamsT): Promise<UserT> {
    try {
      const { data } = await apiClient.get<ResponseApi<UserT>>(
        USER_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: UserCreateDataT): Promise<UserT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<UserT>>(
        USER_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: UserUpdateParamsT): Promise<UserT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<UserT>>(
        USER_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: UserDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        USER_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
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
