import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { INCIDENT_TYPE_ENDPOINTS } from "./incident-type.constants";
import type { IncidentTypeCreateDataT, IncidentTypeDeleteParamsT, IncidentTypeGetParamsT, IncidentTypeListParamsT, IncidentTypeServiceT, IncidentTypeT, IncidentTypeUpdateParamsT } from "./incident-type.types";

class IncidentTypeService implements IncidentTypeServiceT {
  async list(params?: IncidentTypeListParamsT): Promise<IncidentTypeT[]> {
    try { const qs = new URLSearchParams(); if (params?.page) qs.set("page", String(params.page)); if (params?.pageSize) qs.set("page_size", String(params.pageSize)); if (params?.search) qs.set("search", params.search); if (params?.ordering) qs.set("ordering", params.ordering); const query = qs.toString(); const url = query ? `${INCIDENT_TYPE_ENDPOINTS.LIST}?${query}` : INCIDENT_TYPE_ENDPOINTS.LIST; const { data } = await apiClient.get<ResponseApi<PaginatedData<IncidentTypeT>>>(url); return data.data.results; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async get(id: IncidentTypeGetParamsT): Promise<IncidentTypeT> { try { const { data } = await apiClient.get<ResponseApi<IncidentTypeT>>(INCIDENT_TYPE_ENDPOINTS.DETAIL(id)); return data.data; } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); } }
  async create(payload: IncidentTypeCreateDataT): Promise<IncidentTypeT> { try { const { data } = await apiClient.post<ResponseApi<IncidentTypeT>>(INCIDENT_TYPE_ENDPOINTS.LIST, payload); return data.data; } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); } }
  async update(params: IncidentTypeUpdateParamsT): Promise<IncidentTypeT> { try { const { data } = await apiClient.patch<ResponseApi<IncidentTypeT>>(INCIDENT_TYPE_ENDPOINTS.DETAIL(params.id), params.data); return data.data; } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); } }
  async softDelete(id: IncidentTypeDeleteParamsT): Promise<{ id: number }> { try { const { data } = await apiClient.post<ResponseApi<{ id: number }>>(INCIDENT_TYPE_ENDPOINTS.SOFT_DELETE(id)); return data.data; } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); } }
}
export const incidentTypeService = new IncidentTypeService();
