import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { PERMISSION_ENDPOINTS } from "./permission.constants";
import type {
  PermissionCreateDataT,
  PermissionDeleteParamsT,
  PermissionGetParamsT,
  PermissionListParamsT,
  PermissionServiceT,
  PermissionT,
  PermissionUpdateParamsT,
} from "./permission.types";

class PermissionService implements PermissionServiceT {
  async list(params?: PermissionListParamsT): Promise<PermissionT[]> {
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
      const { data } = await apiClient.get<ResponseApi<PaginatedData<PermissionT>>>(
        `${PERMISSION_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filterQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: PermissionGetParamsT): Promise<PermissionT> {
    try {
      const { data } = await apiClient.get<ResponseApi<PermissionT>>(
        PERMISSION_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: PermissionCreateDataT): Promise<PermissionT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<PermissionT>>(
        PERMISSION_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: PermissionUpdateParamsT): Promise<PermissionT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<PermissionT>>(
        PERMISSION_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: PermissionDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        PERMISSION_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const permissionService = new PermissionService();
