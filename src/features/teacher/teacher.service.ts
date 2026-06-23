import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi, PaginatedResponseApi } from "@shared/types/api.response.types";
import { TEACHER_ENDPOINTS } from "./teacher.constants";
import type { TeacherActivityViewT, RosterEntryT, ScheduleEntryT } from "./teacher.types";

class TeacherService {
  async listActivities(p?: { page?: number; pageSize?: number }): Promise<TeacherActivityViewT[]> {
    try {
      const pg = p?.page ?? 1;
      const ps = p?.pageSize ?? 100;
      const { data } = await apiClient.get<PaginatedResponseApi<TeacherActivityViewT[]>>(
        `${TEACHER_ENDPOINTS.ACTIVITIES}?page=${pg}&page_size=${ps}`
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async loadGradingData(params: { teacherSubjectSectionId: number; evaluativeActivityId: number }): Promise<RosterEntryT[]> {
    try {
      const { teacherSubjectSectionId, evaluativeActivityId } = params;
      const { data: tssData } = await apiClient.get<ResponseApi<{ subject_offering_section: number }>>(
        `${TEACHER_ENDPOINTS.TSS}${teacherSubjectSectionId}/`
      );
      const sectionId = tssData.data.subject_offering_section;
      const { data: enrollData } = await apiClient.get<ResponseApi<any[]>>(
        `${TEACHER_ENDPOINTS.ENROLLMENTS}?section_id=${sectionId}&status=ACT`
      );
      const { data: notesData } = await apiClient.get<PaginatedResponseApi<any[]>>(
        `${TEACHER_ENDPOINTS.GRADES}?evaluative_activity=${evaluativeActivityId}&page_size=100`
      );
      const enrollments = Array.isArray(enrollData.data) ? enrollData.data : [];
      const notesList = notesData.data.results ?? [];
      const notesMap = new Map<number, any>();
      for (const n of notesList) {
        notesMap.set(n.enrollment, n);
      }
      return enrollments.map((e: any) => {
        const note = notesMap.get(e.id);
        return {
          enrollmentId: e.id,
          studentName: e.student_name ?? "",
          noteId: note?.id ?? null,
          numericScore: note?.numeric_score ?? null,
          teacherObservation: note?.teacher_observation ?? "",
        };
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async saveGrades(params: { evaluativeActivityId: number; grades: { enrollmentId: number; numericScore: number | null; teacherObservation: string }[] }): Promise<void> {
    try {
      const { evaluativeActivityId, grades } = params;
      const { data: notesData } = await apiClient.get<PaginatedResponseApi<any[]>>(
        `${TEACHER_ENDPOINTS.GRADES}?evaluative_activity=${evaluativeActivityId}&page_size=100`
      );
      const existingNotes = notesData.data.results ?? [];
      const existingMap = new Map<number, any>();
      for (const n of existingNotes) {
        existingMap.set(n.enrollment, n);
      }
      await Promise.all(
        grades.map((g) => {
          const existing = existingMap.get(g.enrollmentId);
          const payload = {
            enrollment: g.enrollmentId,
            evaluative_activity: evaluativeActivityId,
            numeric_score: g.numericScore,
            teacher_observation: g.teacherObservation,
          };
          if (existing) {
            return apiClient.put(`${TEACHER_ENDPOINTS.GRADES}${existing.id}/`, payload);
          }
          return apiClient.post(TEACHER_ENDPOINTS.GRADES, payload);
        })
      );
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async getSchedule(): Promise<ScheduleEntryT[]> {
    try {
      const { data } = await apiClient.get<ResponseApi<any[]>>(TEACHER_ENDPOINTS.SCHEDULE);
      const items = data.data ?? [];
      return items.map((e: any) => ({
        id: e.id,
        dayOfWeek: e.day_of_week,
        dayName: e.day_of_week_name,
        startTime: e.start_time,
        endTime: e.end_time,
        subjectOfferingName: e.subject_offering_name,
        sectionName: e.section_name,
      }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const teacherService = new TeacherService();
