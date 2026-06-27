import { classScheduleService } from "@features/academic/class-schedule";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";
import { selectAuthUser } from "@features/auth/auth.slice";
import { conductIncidentService } from "@features/behavior/conduct-incident/conduct-incident.service";
import { evaluativeActivityService } from "@features/grading/evaluative-activities/evaluative-activities.service";
import { enrollmentService } from "@features/students/enrollments/enrollments.service";
import { useAppSelector } from "@shared/redux/hooks";
import { useEffect, useReducer } from "react";

export interface TeacherCourseT {
  id: number;
  grade: string;
  students: number;
  subject: string;
  nextClass: string;
  pendingGrades: number;
  averageGrade: number;
}
export interface TeacherActivityT {
  title: string;
  type: string;
  date: string;
}
export interface TeacherAlertT {
  student: string;
  section: string;
  level: "Alto" | "Medio";
}
export interface TeacherDashboardDataT {
  courses: TeacherCourseT[];
  upcomingActivities: TeacherActivityT[];
  alerts: TeacherAlertT[];
}

interface State {
  data: TeacherDashboardDataT | null;
  loading: boolean;
  error: string | null;
}
type Action =
  | { type: "loading" }
  | { type: "success"; data: TeacherDashboardDataT }
  | { type: "error"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.data, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.error };
  }
}

const DAY_NAMES: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
};

function formatNextClass(
  schedules: { day_of_week: number; start_time: string }[],
): string {
  if (schedules.length === 0) return "Sin horario";
  const today = new Date().getDay();
  const sorted = schedules.sort((a, b) => {
    const aDiff = (a.day_of_week - today + 7) % 7;
    const bDiff = (b.day_of_week - today + 7) % 7;
    if (aDiff !== bDiff) return aDiff - bDiff;
    return a.start_time.localeCompare(b.start_time);
  });
  const next = sorted[0];
  const diff = (next.day_of_week - today + 7) % 7;
  const time = next.start_time.slice(0, 5);
  if (diff === 0) return `Hoy ${time}`;
  if (diff === 1) return `Mañana ${time}`;
  return `${DAY_NAMES[next.day_of_week] ?? ""} ${time}`;
}

export const useTeacherDashboard = () => {
  const user = useAppSelector(selectAuthUser);
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user?.id) {
      dispatch({
        type: "error",
        error: "No se encontró un usuario autenticado",
      });
      return;
    }
    let cancelled = false;
    dispatch({ type: "loading" });

    const load = async () => {
      try {
        const [{ items: tssList }, allActivities, { items: allSchedules }, { items: allIncidents }] =
          await Promise.all([
            teacherSubjectSectionService.list({
              page: 1,
              pageSize: 100,
              filters: { user: user.id, is_active: true },
            }),
            evaluativeActivityService.list({ page: 1, pageSize: 100 }),
            classScheduleService.list({ page: 1, pageSize: 100 }),
            conductIncidentService.list({ page: 1, pageSize: 100 }),
          ]);
        if (cancelled) return;

        // The list serializer may omit the subject_offering_section FK id (it is
        // present only in the detail endpoint), so resolve it per assignment,
        // falling back to .get() when the list value is missing.
        const sectionByTssId = new Map<number, number>();
        await Promise.all(
          tssList.map(async (t) => {
            let sectionId = t.subject_offering_section ?? null;
            if (!sectionId) {
              try {
                sectionId =
                  (await teacherSubjectSectionService.get({ id: t.id }))
                    .subject_offering_section ?? null;
              } catch {
                sectionId = null;
              }
            }
            if (sectionId) sectionByTssId.set(t.id, sectionId);
          }),
        );
        if (cancelled) return;

        const sectionIds = new Set(sectionByTssId.values());
        const enrollmentCounts = new Map<number, number>();
        await Promise.all(
          Array.from(sectionIds).map(async (sectionId) => {
            try {
              const enrollments = await enrollmentService.listBySection({
                section_id: sectionId,
                status: "ACT",
              });
              enrollmentCounts.set(sectionId, enrollments.length);
            } catch {
              enrollmentCounts.set(sectionId, 0);
            }
          }),
        );
        if (cancelled) return;

        const tssIds = new Set(tssList.map((t) => t.id));
        const scheduleByTss = new Map<number, typeof allSchedules>();
        for (const s of allSchedules) {
          if (!tssIds.has(s.teacher_subject_section)) continue;
          const existing = scheduleByTss.get(s.teacher_subject_section) ?? [];
          existing.push(s);
          scheduleByTss.set(s.teacher_subject_section, existing);
        }

        const activitiesByTss = new Map<number, typeof allActivities>();
        for (const a of allActivities) {
          if (!tssIds.has(a.teacher_subject_section)) continue;
          const existing = activitiesByTss.get(a.teacher_subject_section) ?? [];
          existing.push(a);
          activitiesByTss.set(a.teacher_subject_section, existing);
        }

        const courses: TeacherCourseT[] = tssList.map((tss) => {
          const sectionId = sectionByTssId.get(tss.id) ?? null;
          const sectionSchedules = scheduleByTss.get(tss.id) ?? [];
          const sectionActivities = activitiesByTss.get(tss.id) ?? [];
          const studentCount = sectionId
            ? (enrollmentCounts.get(sectionId) ?? 0)
            : 0;
          return {
            id: tss.id,
            grade:
              [
                tss.subject_offering_academic_grade_name,
                tss.subject_offering_section_name,
              ]
                .filter(Boolean)
                .join(" - ") || "Sin sección",
            students: studentCount,
            subject:
              tss.subject_offering_subject_name ?? tss.subject_offering_name,
            nextClass: formatNextClass(sectionSchedules),
            pendingGrades: sectionActivities.filter((a) => a.is_active).length,
            averageGrade: 0,
          };
        });

        const sortedActivities = [...allActivities]
          .filter((a) => tssIds.has(a.teacher_subject_section) && a.is_active)
          .sort((a, b) => a.due_date.localeCompare(b.due_date))
          .slice(0, 5)
          .map((a) => ({
            title: a.title,
            type: a.block_component_name || "Actividad",
            date: a.due_date,
          }));

        const alerts: TeacherAlertT[] = allIncidents
          .slice(0, 5)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((inc) => ({
            student: inc.enrollment_name ?? "Estudiante",
            section: `${inc.incident_type_name ?? "Incidente"} | ${inc.severity_name ?? ""}`,
            level: (inc.severity_name?.toLowerCase().includes("alto")
              ? "Alto"
              : "Medio") as "Alto" | "Medio",
          }));

        if (!cancelled)
          dispatch({
            type: "success",
            data: { courses, upcomingActivities: sortedActivities, alerts },
          });
      } catch {
        if (!cancelled)
          dispatch({
            type: "error",
            error: "Error al cargar los datos del dashboard",
          });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return state;
};
