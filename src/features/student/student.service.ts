import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { ATTENDANCE_API, BEHAVIOR_API, GRADING_API, STUDENT_API } from "./student.constants";
import type {
  AttendanceRecord,
  BehaviorEvaluationRaw,
  ConductIncidentRaw,
  EnrollmentInfo,
  EvaluativeActivityRaw,
  PeriodGradeSummaryRaw,
  StudentNoteRaw,
} from "./student.types";
class StudentService {
  async getActiveEnrollment(studentId: number): Promise<EnrollmentInfo> {
    try {
      const { data } = await apiClient.get<ResponseApi<EnrollmentInfo>>(
        `${STUDENT_API.BASE}enrollments/by-student/?student_id=${studentId}`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getAttendances(enrollmentId: number): Promise<AttendanceRecord[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: AttendanceRecord[] }>
      >(`${ATTENDANCE_API.BASE}attendances/?enrollment=${enrollmentId}`);
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getBehaviorEvaluations(
    enrollmentId: number,
  ): Promise<BehaviorEvaluationRaw[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: BehaviorEvaluationRaw[] }>
      >(`${BEHAVIOR_API.BASE}behavior-evaluations/?enrollment=${enrollmentId}`);
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getPeriodGradeSummaries(
    enrollmentId: number,
    periodId: number,
  ): Promise<PeriodGradeSummaryRaw[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: PeriodGradeSummaryRaw[] }>
      >(
        `${GRADING_API.BASE}period-grade-summaries/?enrollment=${enrollmentId}&academic_period=${periodId}`,
      );
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getIncidents(): Promise<ConductIncidentRaw[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: ConductIncidentRaw[] }>
      >(`${BEHAVIOR_API.BASE}conduct-incidents/`);
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getStudentNotes(): Promise<StudentNoteRaw[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: StudentNoteRaw[] }>
      >(`${GRADING_API.BASE}student-notes/`);
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getEvaluativeActivities(): Promise<EvaluativeActivityRaw[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: EvaluativeActivityRaw[] }>
      >(`${GRADING_API.BASE}evaluative-activities/`);
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async getGrades(): Promise<PeriodGradeSummaryRaw[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results: PeriodGradeSummaryRaw[] }>
      >(`${GRADING_API.BASE}period-grade-summaries/`);
      return data.data.results ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}
export const studentApiService = new StudentService();
