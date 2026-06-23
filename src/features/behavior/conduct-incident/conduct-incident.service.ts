import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { CONDUCT_INCIDENT_ENDPOINTS } from "./conduct-incident.constants";
import type { ConductIncidentCreateDataT, ConductIncidentGetParamsT, ConductIncidentListParamsT, ConductIncidentServiceT, ConductIncidentT, ConductIncidentUpdateParamsT } from "./conduct-incident.types";

class ConductIncidentService implements ConductIncidentServiceT {
  async list(params?: ConductIncidentListParamsT): Promise<ConductIncidentT[]> {
    try {
      const qs = new URLSearchParams();
      if (params?.page) qs.set("page", String(params.page));
      if (params?.pageSize) qs.set("page_size", String(params.pageSize));
      if (params?.search) qs.set("search", params.search);
      if (params?.ordering) qs.set("ordering", params.ordering);
      if (params?.enrollment) qs.set("enrollment", String(params.enrollment));
      const query = qs.toString();
      const url = query ? `${CONDUCT_INCIDENT_ENDPOINTS.LIST}?${query}` : CONDUCT_INCIDENT_ENDPOINTS.LIST;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<ConductIncidentT>>>(url);
      return data.data.results;
    } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async get(id: ConductIncidentGetParamsT): Promise<ConductIncidentT> {
    try { const { data } = await apiClient.get<ResponseApi<ConductIncidentT>>(CONDUCT_INCIDENT_ENDPOINTS.DETAIL(id)); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async create(payload: ConductIncidentCreateDataT): Promise<ConductIncidentT> {
    try { const { data } = await apiClient.post<ResponseApi<ConductIncidentT>>(CONDUCT_INCIDENT_ENDPOINTS.LIST, payload); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async update(params: ConductIncidentUpdateParamsT): Promise<ConductIncidentT> {
    try { const { data } = await apiClient.patch<ResponseApi<ConductIncidentT>>(CONDUCT_INCIDENT_ENDPOINTS.DETAIL(params.id), params.data); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
}

export const conductIncidentService = new ConductIncidentService();
