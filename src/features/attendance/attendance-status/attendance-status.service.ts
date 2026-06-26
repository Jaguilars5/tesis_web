import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { ATTENDANCE_STATUS_ENDPOINTS } from "./attendance-status.constants";
import type {
  AttendanceStatusCreateParamsT,
  AttendanceStatusDeleteParamsT,
  AttendanceStatusGetParamsT,
  AttendanceStatusListParamsT,
  AttendanceStatusServiceT,
  AttendanceStatusT,
  AttendanceStatusUpdateParamsT,
} from "./attendance-status.types";

class AttendanceStatusService implements AttendanceStatusServiceT {
  async list(params?: AttendanceStatusListParamsT): Promise<AttendanceStatusT[]> {
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
        ResponseApi<PaginatedData<AttendanceStatusT>>
      >(
        `${ATTENDANCE_STATUS_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: AttendanceStatusGetParamsT): Promise<AttendanceStatusT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AttendanceStatusT>>(
        ATTENDANCE_STATUS_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: AttendanceStatusCreateParamsT): Promise<AttendanceStatusT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AttendanceStatusT>>(
        ATTENDANCE_STATUS_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AttendanceStatusUpdateParamsT): Promise<AttendanceStatusT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AttendanceStatusT>>(
        ATTENDANCE_STATUS_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: AttendanceStatusDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(ATTENDANCE_STATUS_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const attendanceStatusService = new AttendanceStatusService();
