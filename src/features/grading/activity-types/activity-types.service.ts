import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { ACTIVITY_TYPES_ENDPOINTS } from "./activity-types.constants";
import type {
  ActivityTypeCreateParamsT,
  ActivityTypeDeleteParamsT,
  ActivityTypeGetParamsT,
  ActivityTypeListParamsT,
  ActivityTypeServiceT,
  ActivityTypeT,
  ActivityTypeUpdateParamsT,
} from "./activity-types.types";

class ActivityTypeService implements ActivityTypeServiceT {
  async list(params?: ActivityTypeListParamsT): Promise<PaginatedResult<ActivityTypeT>> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<ActivityTypeT>>
      >(
        `${ACTIVITY_TYPES_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: ActivityTypeGetParamsT): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ActivityTypeT>>(
        ACTIVITY_TYPES_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: ActivityTypeCreateParamsT): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ActivityTypeT>>(
        ACTIVITY_TYPES_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: ActivityTypeUpdateParamsT): Promise<ActivityTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ActivityTypeT>>(
        ACTIVITY_TYPES_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: ActivityTypeDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(ACTIVITY_TYPES_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const activityTypeService = new ActivityTypeService();
