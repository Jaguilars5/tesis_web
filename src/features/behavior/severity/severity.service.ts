import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { SEVERITY_ENDPOINTS } from "./severity.constants";
import type {
  SeverityCreateParamsT,
  SeverityDeleteParamsT,
  SeverityGetParamsT,
  SeverityListParamsT,
  SeverityServiceT,
  SeverityT,
  SeverityUpdateParamsT,
} from "./severity.types";

class SeverityService implements SeverityServiceT {
  async list(params?: SeverityListParamsT): Promise<PaginatedResult<SeverityT>> {
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
        ResponseApi<PaginatedData<SeverityT>>
      >(
        `${SEVERITY_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: SeverityGetParamsT): Promise<SeverityT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SeverityT>>(
        SEVERITY_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: SeverityCreateParamsT): Promise<SeverityT> {
    try {
      const { data } = await apiClient.post<ResponseApi<SeverityT>>(
        SEVERITY_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: SeverityUpdateParamsT): Promise<SeverityT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<SeverityT>>(
        SEVERITY_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: SeverityDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(SEVERITY_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const severityService = new SeverityService();
