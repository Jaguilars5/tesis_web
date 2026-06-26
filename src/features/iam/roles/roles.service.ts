import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { ROLE_ENDPOINTS } from "./roles.constants";
import type {
  RoleAssignPermissionsDataT,
  RoleCreateDataT,
  RoleDeleteParamsT,
  RoleGetParamsT,
  RoleListParamsT,
  RoleServiceT,
  RoleT,
  RoleUpdateParamsT,
} from "./roles.types";

class RoleService implements RoleServiceT {
  async list(params?: RoleListParamsT): Promise<RoleT[]> {
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
      const { data } = await apiClient.get<ResponseApi<PaginatedData<RoleT>>>(
        `${ROLE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filterQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: RoleGetParamsT): Promise<RoleT> {
    try {
      const { data } = await apiClient.get<ResponseApi<RoleT>>(
        ROLE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: RoleCreateDataT): Promise<RoleT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<RoleT>>(
        ROLE_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: RoleUpdateParamsT): Promise<RoleT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<RoleT>>(
        ROLE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: RoleDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        ROLE_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async assignPermissions(id: number, payload: RoleAssignPermissionsDataT): Promise<void> {
    try {
      await apiClient.post(ROLE_ENDPOINTS.ASSIGN_PERMISSIONS(id), payload);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const roleService = new RoleService();
