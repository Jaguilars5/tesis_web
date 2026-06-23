import { useEffect, useReducer } from "react";
import { useAppSelector } from "@shared/redux/hooks";
import { selectAuthUser } from "@features/auth/auth.slice";
import { UserRoleEnum } from "@features/auth";
import { academicPeriodService } from "@features/academic/academic-period";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";
import { absenceTypeService } from "@features/attendance/absence-type/absence-type.service";
import { attendanceStatusService } from "@features/attendance/attendance-status/attendance-status.service";
import { enrollmentService } from "@features/students/enrollments/enrollments.service";

interface Option { label: string; value: string; }
interface State { options: Option[]; loading: boolean; }
type Action = { type: "loading" } | { type: "success"; options: Option[] } | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { options: [], loading: true };
    case "success": return { options: action.options, loading: false };
    case "error": return { options: [], loading: false };
  }
}

export const useEnrollmentOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    enrollmentService.list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: i.student_name ?? `Matrícula ${i.id}`, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, []);
  return { enrollmentOptions: state.options, loading: state.loading };
};

export const useTeacherSubjectSectionOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  const user = useAppSelector(selectAuthUser);
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    const params: any = { page: 1, pageSize: 100 };
    if (user?.role === UserRoleEnum.TEACHER) params.filters = { user: user.id, is_active: true };
    teacherSubjectSectionService.list(params)
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: `${i.subject_offering_name} - ${i.subject_offering_section_name ?? ""}`, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, [user]);
  return { teacherSubjectSectionOptions: state.options, loading: state.loading };
};

export interface AcademicPeriodOptionT extends Option { startDate: string; endDate: string; }

export const useAcademicPeriodOptions = () => {
  const [state, setState] = useReducer((_s: { options: AcademicPeriodOptionT[]; loading: boolean }, a: { type: "loading" } | { type: "success"; options: AcademicPeriodOptionT[] } | { type: "error" }) => {
    switch (a.type) {
      case "loading": return { options: [], loading: true };
      case "success": return { options: a.options, loading: false };
      case "error": return { options: [], loading: false };
    }
  }, { options: [], loading: true });
  const user = useAppSelector(selectAuthUser);
  useEffect(() => {
    let cancelled = false;
    setState({ type: "loading" });
    academicPeriodService.list({ page: 1, pageSize: 100 })
      .then((items) => {
        let filtered = items;
        if (user?.role === UserRoleEnum.TEACHER) filtered = items.filter((i) => i.is_active);
        if (!cancelled) setState({ type: "success", options: filtered.map((i) => ({ label: i.name, value: String(i.id), startDate: i.start_date, endDate: i.end_date })) });
      })
      .catch(() => { if (!cancelled) setState({ type: "error" }); });
    return () => { cancelled = true; };
  }, [user]);
  return { academicPeriodOptions: state.options, loading: state.loading };
};

export const useAttendanceStatusOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    attendanceStatusService.list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: i.name, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, []);
  return { attendanceStatusOptions: state.options, loading: state.loading };
};

export const useAbsenceTypeOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    absenceTypeService.list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: i.name, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, []);
  return { absenceTypeOptions: state.options, loading: state.loading };
};
