import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";

import { TEACHER_ENDPOINTS } from "./teacher.constants";
import type { ScheduleEntryT, TeacherServiceT } from "./teacher.types";

interface RawScheduleEntry {
  id: number;
  day_of_week: number;
  day_of_week_name: string;
  start_time: string;
  end_time: string;
  subject_offering_name: string;
  section_name: string;
  is_active: boolean;
}

class TeacherService implements TeacherServiceT {
  async getSchedule(): Promise<ScheduleEntryT[]> {
    try {
      const { data } = await apiClient.get<ResponseApi<RawScheduleEntry[]>>(
        TEACHER_ENDPOINTS.SCHEDULE,
      );
      const items = Array.isArray(data.data) ? data.data : [];
      return items
        .filter((entry) => entry.is_active)
        .map((entry) => ({
          id: entry.id,
          dayOfWeek: entry.day_of_week,
          dayName: entry.day_of_week_name,
          startTime: entry.start_time,
          endTime: entry.end_time,
          subjectOfferingName: entry.subject_offering_name,
          sectionName: entry.section_name,
        }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const teacherService = new TeacherService();
