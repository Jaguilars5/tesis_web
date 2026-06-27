import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  PaginatedResult,
  ResponseApi,
} from "@shared/types/api.response.types";
import { CONDUCT_INCIDENT_ENDPOINTS } from "./conduct-incident.constants";
import type {
  ConductIncidentCreateParamsT,
  ConductIncidentGetParamsT,
  ConductIncidentListParamsT,
  ConductIncidentServiceT,
  ConductIncidentT,
  ConductIncidentUpdateParamsT,
} from "./conduct-incident.types";

class ConductIncidentService implements ConductIncidentServiceT {
  async list(
    params?: ConductIncidentListParamsT,
  ): Promise<PaginatedResult<ConductIncidentT>> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const filtersQuery = params?.filters
        ? `&${Object.entries(params.filters)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(
              ([key, value]) => `${key}=${encodeURIComponent(String(value))}`,
            )
            .join("&")}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<ConductIncidentT>>
      >(
        `${CONDUCT_INCIDENT_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: ConductIncidentGetParamsT): Promise<ConductIncidentT> {
    try {
      const { data } = await apiClient.get<ResponseApi<ConductIncidentT>>(
        CONDUCT_INCIDENT_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(
    payload: ConductIncidentCreateParamsT,
  ): Promise<ConductIncidentT> {
    try {
      const { data } = await apiClient.post<ResponseApi<ConductIncidentT>>(
        CONDUCT_INCIDENT_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(
    params: ConductIncidentUpdateParamsT,
  ): Promise<ConductIncidentT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<ConductIncidentT>>(
        CONDUCT_INCIDENT_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const conductIncidentService = new ConductIncidentService();
