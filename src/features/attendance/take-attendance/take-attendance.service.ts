import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { TAKE_ATTENDANCE_ENDPOINTS } from "./take-attendance.constants";
import type {
  TakeByScheduleResponseT,
  TakeByScheduleSavePayloadT,
  TakeByScheduleSaveResultT,
} from "./take-attendance.types";

export interface GetRosterParamsT {
  classScheduleId: number;
  date: string;
}

class TakeAttendanceService {
  async getRoster(params: GetRosterParamsT): Promise<TakeByScheduleResponseT> {
    try {
      const { data } = await apiClient.get<ResponseApi<TakeByScheduleResponseT>>(
        TAKE_ATTENDANCE_ENDPOINTS.GET_ROSTER(params.classScheduleId, params.date),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async saveAttendance(
    payload: TakeByScheduleSavePayloadT,
  ): Promise<TakeByScheduleSaveResultT> {
    try {
      const { data } = await apiClient.post<
        ResponseApi<TakeByScheduleSaveResultT>
      >(TAKE_ATTENDANCE_ENDPOINTS.SAVE_ROSTER, payload);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const takeAttendanceService = new TakeAttendanceService();
