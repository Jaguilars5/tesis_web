import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { ATTENDANCE_ENDPOINTS } from "./attendance.constants";
import type {
  AttendanceCreateDataT,
  AttendanceGetParamsT,
  AttendanceListParamsT,
  AttendanceServiceT,
  AttendanceT,
  AttendanceUpdateParamsT,
} from "./attendance.types";

class AttendanceService implements AttendanceServiceT {
  async list(params?: AttendanceListParamsT): Promise<AttendanceT[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.pageSize) queryParams.set("page_size", String(params.pageSize));
      if (params?.search) queryParams.set("search", params.search);
      if (params?.ordering) queryParams.set("ordering", params.ordering);
      const query = queryParams.toString();
      const url = query ? `${ATTENDANCE_ENDPOINTS.LIST}?${query}` : ATTENDANCE_ENDPOINTS.LIST;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<AttendanceT>>>(url);
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: AttendanceGetParamsT): Promise<AttendanceT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AttendanceT>>(ATTENDANCE_ENDPOINTS.DETAIL(id));
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: AttendanceCreateDataT): Promise<AttendanceT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AttendanceT>>(ATTENDANCE_ENDPOINTS.LIST, payload);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AttendanceUpdateParamsT): Promise<AttendanceT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AttendanceT>>(ATTENDANCE_ENDPOINTS.DETAIL(params.id), params.data);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const attendanceService = new AttendanceService();
