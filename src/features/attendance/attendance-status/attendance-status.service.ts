import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { ATTENDANCE_STATUS_ENDPOINTS } from "./attendance-status.constants";
import type { AttendanceStatusCreateDataT, AttendanceStatusDeleteParamsT, AttendanceStatusGetParamsT, AttendanceStatusListParamsT, AttendanceStatusServiceT, AttendanceStatusT, AttendanceStatusUpdateParamsT } from "./attendance-status.types";

class AttendanceStatusService implements AttendanceStatusServiceT {
  async list(params?: AttendanceStatusListParamsT): Promise<AttendanceStatusT[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.pageSize) queryParams.set("page_size", String(params.pageSize));
      if (params?.search) queryParams.set("search", params.search);
      if (params?.ordering) queryParams.set("ordering", params.ordering);
      const query = queryParams.toString();
      const url = query ? `${ATTENDANCE_STATUS_ENDPOINTS.LIST}?${query}` : ATTENDANCE_STATUS_ENDPOINTS.LIST;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<AttendanceStatusT>>>(url);
      return data.data.results;
    } catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async get(id: AttendanceStatusGetParamsT): Promise<AttendanceStatusT> {
    try { const { data } = await apiClient.get<ResponseApi<AttendanceStatusT>>(ATTENDANCE_STATUS_ENDPOINTS.DETAIL(id)); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async create(payload: AttendanceStatusCreateDataT): Promise<AttendanceStatusT> {
    try { const { data } = await apiClient.post<ResponseApi<AttendanceStatusT>>(ATTENDANCE_STATUS_ENDPOINTS.LIST, payload); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async update(params: AttendanceStatusUpdateParamsT): Promise<AttendanceStatusT> {
    try { const { data } = await apiClient.patch<ResponseApi<AttendanceStatusT>>(ATTENDANCE_STATUS_ENDPOINTS.DETAIL(params.id), params.data); return data.data; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
  async delete(id: AttendanceStatusDeleteParamsT): Promise<{ id: number }> {
    try { await apiClient.delete(ATTENDANCE_STATUS_ENDPOINTS.DETAIL(id)); return { id }; }
    catch (error) { throw new Error(getApiErrorMessage(error), { cause: error }); }
  }
}

export const attendanceStatusService = new AttendanceStatusService();
