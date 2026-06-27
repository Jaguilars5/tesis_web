import { selectAuthUser } from "@features/auth/auth.slice";
import { academicPeriodService } from "@features/academic/academic-period";
import { studentApiService } from "./student.service";
import { useAppSelector } from "@shared/redux/hooks";
import { useEffect, useReducer } from "react";
import { mapGradeActivities } from "./student.utils";
import type { AttendanceRecord } from "./student.types";
interface DashboardData {
  enrollment: { id: number; section_name: string };
  overallAverage: number | null;
  attendanceRate: number | null;
  attendanceSummary: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  totalSubjects: number;
  recoverySubjects: number;
  subjects: {
    name: string;
    average: number;
    qualitativeScale: string | null;
    isFailing: boolean;
  }[];
  conductEval: { scale: number; scaleName: string } | null;
}
interface State {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}
type Action =
  | { type: "loading" }
  | { type: "success"; data: DashboardData }
  | { type: "error"; error: string }
  | { type: "noStudent" };
function reducer(_s: State, a: Action): State {
  switch (a.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: a.data, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: a.error };
    case "noStudent":
      return {
        data: null,
        loading: false,
        error: "No se encontró un estudiante asociado a tu cuenta",
      };
  }
}
export const useStudentDashboard = () => {
  const user = useAppSelector(selectAuthUser);
  const studentId = user?.student_id ?? null;
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    if (!studentId) {
      dispatch({ type: "noStudent" });
      return;
    }
    let c = false;
    dispatch({ type: "loading" });
    (async () => {
      try {
        const enrollment =
          await studentApiService.getActiveEnrollment(studentId);
        const [{ items: periods }, attendance, conductResults] = await Promise.all([
          academicPeriodService.list({ page: 1, pageSize: 100 }),
          studentApiService.getAttendances(enrollment.id),
          studentApiService.getBehaviorEvaluations(enrollment.id),
        ]);
        let overallAverage: number | null = null;
        let recoveryCount = 0;
        let subjects: DashboardData["subjects"] = [];
        if (periods.length > 0) {
          const summaries = await studentApiService.getPeriodGradeSummaries(
            enrollment.id,
            periods[0].id,
          );
          const mapped = mapGradeActivities(summaries);
          subjects = mapped.subjects;
          overallAverage = mapped.overallAverage;
          recoveryCount = mapped.recoveryCount;
        }
        let present = 0;
        let absent = 0;
        let late = 0;
        attendance.forEach((r: AttendanceRecord) => {
          const n = r.attendance_status_name.toLowerCase();
          if (n.includes("presente")) present++;
          else if (n.includes("ausente") || n.includes("falta")) absent++;
          else if (n.includes("atraso") || n.includes("tardanza")) late++;
        });
        const totalAttendance = attendance.length;
        const attendanceRate =
          totalAttendance > 0
            ? Math.round((present / totalAttendance) * 100)
            : null;
        const conductEval =
          conductResults.length > 0 ? conductResults[0] : null;
        if (!c)
          dispatch({
            type: "success",
            data: {
              enrollment: {
                id: enrollment.id,
                section_name: enrollment.section_name,
              },
              overallAverage,
              attendanceRate,
              attendanceSummary: {
                present,
                absent,
                late,
                total: totalAttendance,
              },
              totalSubjects: subjects.length,
              recoverySubjects: recoveryCount,
              subjects,
              conductEval: conductEval
                ? {
                    scale:
                      conductEval.final_scale ?? conductEval.calculated_scale,
                    scaleName:
                      conductEval.final_scale_name ??
                      conductEval.calculated_scale_name,
                  }
                : null,
            },
          });
      } catch {
        if (!c)
          dispatch({
            type: "error",
            error: "Error al cargar los datos del dashboard",
          });
      }
    })();
    return () => {
      c = true;
    };
  }, [studentId]);
  return state;
};
