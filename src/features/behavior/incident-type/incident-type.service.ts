import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { INCIDENT_TYPE_ENDPOINTS } from "./incident-type.constants";
import type {
  IncidentTypeCreateParamsT,
  IncidentTypeDeleteParamsT,
  IncidentTypeGetParamsT,
  IncidentTypeListParamsT,
  IncidentTypeServiceT,
  IncidentTypeT,
  IncidentTypeUpdateParamsT,
} from "./incident-type.types";

class IncidentTypeService implements IncidentTypeServiceT {
  async list(
    params?: IncidentTypeListParamsT,
  ): Promise<PaginatedResult<IncidentTypeT>> {
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
        ResponseApi<PaginatedData<IncidentTypeT>>
      >(
        `${INCIDENT_TYPE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: IncidentTypeGetParamsT): Promise<IncidentTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<IncidentTypeT>>(
        INCIDENT_TYPE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: IncidentTypeCreateParamsT): Promise<IncidentTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<IncidentTypeT>>(
        INCIDENT_TYPE_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: IncidentTypeUpdateParamsT): Promise<IncidentTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<IncidentTypeT>>(
        INCIDENT_TYPE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: IncidentTypeDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(INCIDENT_TYPE_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const incidentTypeService = new IncidentTypeService();
