import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import { ATTENDANCE_ENDPOINTS } from "./attendance.constants";
import type {
  AttendanceCreateParamsT,
  AttendanceGetParamsT,
  AttendanceListParamsT,
  AttendanceServiceT,
  AttendanceT,
  AttendanceUpdateParamsT,
} from "./attendance.types";

class AttendanceService implements AttendanceServiceT {
  async list(
    params?: AttendanceListParamsT,
  ): Promise<PaginatedResult<AttendanceT>> {
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
        ResponseApi<PaginatedData<AttendanceT>>
      >(
        `${ATTENDANCE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: AttendanceGetParamsT): Promise<AttendanceT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AttendanceT>>(
        ATTENDANCE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: AttendanceCreateParamsT): Promise<AttendanceT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AttendanceT>>(
        ATTENDANCE_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AttendanceUpdateParamsT): Promise<AttendanceT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AttendanceT>>(
        ATTENDANCE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const attendanceService = new AttendanceService();
