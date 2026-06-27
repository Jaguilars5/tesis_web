import { selectAuthUser } from "@features/auth/auth.slice";
import { academicPeriodService } from "@features/academic/academic-period";
import { studentApiService } from "@features/student/student.service";
import { useAppSelector } from "@shared/redux/hooks";
import { useEffect, useReducer } from "react";

import type { AttendanceRecord } from "@features/student/student.types";

export interface StudentDashboardData {
  enrollment: { id: number; section_name: string };
  overallAverage: number | null;
  attendanceRate: number | null;
  attendanceSummary: { present: number; absent: number; late: number; total: number };
  totalSubjects: number;
  recoverySubjects: number;
  subjects: { name: string; average: number | null; qualitativeScale: string | null; isFailing: boolean }[];
  conductEval: { scale: number; scaleName: string } | null;
}

interface State { data: StudentDashboardData | null; loading: boolean; error: string | null; }
type Action = { type: "loading" } | { type: "success"; data: StudentDashboardData } | { type: "error"; error: string } | { type: "noStudent" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { data: null, loading: true, error: null };
    case "success": return { data: action.data, loading: false, error: null };
    case "error": return { data: null, loading: false, error: action.error };
    case "noStudent": return { data: null, loading: false, error: "No se encontró un estudiante asociado a tu cuenta" };
  }
}

export const useStudentDashboard = () => {
  const user = useAppSelector(selectAuthUser);
  const studentId = user?.student_id ?? null;
  const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: null });

  useEffect(() => {
    if (!studentId) { dispatch({ type: "noStudent" }); return; }
    let cancelled = false;
    dispatch({ type: "loading" });

    const load = async () => {
      try {
        const enrollment = await studentApiService.getActiveEnrollment(studentId);
        const [{ items: periods }, attendance, conductResults] = await Promise.all([
          academicPeriodService.list({ page: 1, pageSize: 100 }),
          studentApiService.getAttendances(enrollment.id),
          studentApiService.getBehaviorEvaluations(enrollment.id),
        ]);
        let overallAverage: number | null = null;
        let recoveryCount = 0;
        let subjects: StudentDashboardData["subjects"] = [];

        if (periods.length > 0) {
          const summaries = await studentApiService.getPeriodGradeSummaries(enrollment.id, periods[0].id);
          subjects = summaries.map((s) => ({
            name: s.subject_offering_name,
            average: s.final_avg_truncated,
            qualitativeScale: s.qualitative_scale_name,
            isFailing: s.is_failing,
          }));
          const validAverages = subjects.filter((s) => s.average !== null).map((s) => s.average as number);
          if (validAverages.length > 0) overallAverage = Math.round((validAverages.reduce((a, b) => a + b, 0) / validAverages.length) * 10) / 10;
          recoveryCount = subjects.filter((s) => s.isFailing).length;
        }

        let present = 0, absent = 0, late = 0;
        attendance.forEach((r: AttendanceRecord) => {
          const name = r.attendance_status_name.toLowerCase();
          if (name.includes("presente")) present++;
          else if (name.includes("ausente") || name.includes("falta")) absent++;
          else if (name.includes("atraso") || name.includes("tardanza")) late++;
        });
        const totalAttendance = attendance.length;
        const attendanceRate = totalAttendance > 0 ? Math.round((present / totalAttendance) * 100) : null;
        // conductResults already resolved above
        const conductEval = conductResults.length > 0 ? conductResults[0] : null;

        if (!cancelled) {
          dispatch({
            type: "success",
            data: {
              enrollment: { id: enrollment.id, section_name: enrollment.section_name },
              overallAverage, attendanceRate,
              attendanceSummary: { present, absent, late, total: totalAttendance },
              totalSubjects: subjects.length, recoverySubjects: recoveryCount, subjects,
              conductEval: conductEval ? { scale: conductEval.final_scale ?? conductEval.calculated_scale, scaleName: conductEval.final_scale_name ?? conductEval.calculated_scale_name } : null,
            },
          });
        }
      } catch {
        if (!cancelled) dispatch({ type: "error", error: "Error al cargar los datos del dashboard" });
      }
    };
    load();
    return () => { cancelled = true; };
  }, [studentId]);

  return state;
};
