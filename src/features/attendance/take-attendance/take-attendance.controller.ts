import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@shared/services/api.client";
import { enrollmentService } from "@features/students/enrollments/enrollments.service";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";
import { useTeacherSubjectSectionOptions } from "@features/attendance/attendance";
import { useAcademicPeriodOptions } from "@features/attendance/attendance";
import { useAttendanceStatusOptions } from "@features/attendance/attendance";
import { useAbsenceTypeOptions } from "@features/attendance/attendance";

import { TAKE_ATTENDANCE_ENDPOINTS } from "./take-attendance.constants";

import type { AttendanceT } from "@features/attendance/attendance";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { RosterEntryT, TakeAttendanceStateT } from "./take-attendance.types";

const initialState: TakeAttendanceStateT = {
  teacherSubjectSectionId: null,
  academicPeriodId: null,
  attendanceDate: new Date().toISOString().split("T")[0],
  roster: [],
  loadingRoster: false,
  saving: false,
  loaded: false,
  error: null,
  success: false,
};

export const useTakeAttendance = () => {
  const { teacherSubjectSectionOptions, loading: loadingTSS } = useTeacherSubjectSectionOptions();
  const { academicPeriodOptions, loading: loadingPeriods } = useAcademicPeriodOptions();
  const { attendanceStatusOptions, loading: loadingStatuses } = useAttendanceStatusOptions();
  const { absenceTypeOptions, loading: loadingAbsenceTypes } = useAbsenceTypeOptions();

  const [state, setState] = useState<TakeAttendanceStateT>(initialState);

  useEffect(() => {
    if (academicPeriodOptions.length > 0 && state.attendanceDate) {
      const dateStr = state.attendanceDate;
      const matched = academicPeriodOptions.find((opt) =>
        opt.startDate && opt.endDate && dateStr >= opt.startDate && dateStr <= opt.endDate
      );
      const targetId = matched ? Number(matched.value) : Number(academicPeriodOptions[0].value);
      if (state.academicPeriodId !== targetId) {
        setState((prev) => ({ ...prev, academicPeriodId: targetId }));
      }
    }
  }, [academicPeriodOptions, state.attendanceDate, state.academicPeriodId]);

  const setTeacherSubjectSectionId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, teacherSubjectSectionId: id, loaded: false, roster: [], success: false }));
  }, []);

  const setAcademicPeriodId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, academicPeriodId: id, loaded: false, roster: [], success: false }));
  }, []);

  const setAttendanceDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, attendanceDate: date, loaded: false, roster: [], success: false }));
  }, []);

  const updateRosterEntry = useCallback(
    (enrollmentId: number, updates: Partial<Omit<RosterEntryT, "enrollmentId" | "studentName">>) => {
      setState((prev) => ({
        ...prev,
        roster: prev.roster.map((entry) =>
          entry.enrollmentId === enrollmentId ? { ...entry, ...updates } : entry,
        ),
      }));
    },
    [],
  );

  const loadRoster = useCallback(async () => {
    const { teacherSubjectSectionId, academicPeriodId, attendanceDate } = state;
    if (!teacherSubjectSectionId || !academicPeriodId || !attendanceDate) return;

    setState((prev) => ({ ...prev, loadingRoster: true, error: null, loaded: false, success: false }));

    try {
      const tss = await teacherSubjectSectionService.get({ id: teacherSubjectSectionId });
      const sectionId = tss.subject_offering_section;
      if (!sectionId) throw new Error("La clase no tiene una sección asignada");

      const [enrollments, existingAttendances] = await Promise.all([
        enrollmentService.listBySection({ section_id: sectionId, status: "ACT" }),
        apiClient.get<ResponseApi<PaginatedData<AttendanceT>>>(
          `/api/attendance/attendances/?teacher_subject_section=${teacherSubjectSectionId}&attendance_date=${attendanceDate}&academic_period=${academicPeriodId}&page_size=100`,
        ).then((res) => res.data.data.results ?? []),
      ]);

      const attendanceMap = new Map<number, AttendanceT>();
      existingAttendances.forEach((a) => attendanceMap.set(a.enrollment, a));

      const roster: RosterEntryT[] = enrollments.map((e) => {
        const existing = attendanceMap.get(e.id);
        return {
          enrollmentId: e.id,
          studentName: e.student_name,
          attendanceId: existing?.id ?? null,
          attendanceStatusId: existing?.attendance_status ?? null,
          absenceTypeId: existing?.absence_type ?? null,
          observation: existing?.observation ?? "",
        };
      });

      setState((prev) => ({ ...prev, roster, loadingRoster: false, loaded: true }));
    } catch (err) {
      setState((prev) => ({
        ...prev, loadingRoster: false,
        error: err instanceof Error ? err.message : "Error al cargar estudiantes",
      }));
    }
  }, [state.teacherSubjectSectionId, state.academicPeriodId, state.attendanceDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveAttendance = useCallback(async () => {
    const { teacherSubjectSectionId, academicPeriodId, attendanceDate, roster } = state;
    if (!teacherSubjectSectionId || !academicPeriodId || !attendanceDate) return;

    setState((prev) => ({ ...prev, saving: true, error: null, success: false }));

    try {
      const records = roster
        .filter((entry) => entry.attendanceStatusId !== null)
        .map((entry) => ({
          enrollment: entry.enrollmentId,
          teacher_subject_section: teacherSubjectSectionId,
          academic_period: academicPeriodId,
          attendance_date: attendanceDate,
          attendance_status: entry.attendanceStatusId,
          absence_type: entry.absenceTypeId,
          observation: entry.observation,
        }));

      await apiClient.post(TAKE_ATTENDANCE_ENDPOINTS.BATCH, { records });
      setState((prev) => ({ ...prev, saving: false, loaded: false, success: true }));
    } catch (err) {
      setState((prev) => ({
        ...prev, saving: false,
        error: err instanceof Error ? err.message : "Error al guardar asistencias", success: false,
      }));
    }
  }, [state.teacherSubjectSectionId, state.academicPeriodId, state.attendanceDate, state.roster]); // eslint-disable-line react-hooks/exhaustive-deps

  const canLoad = !!(state.teacherSubjectSectionId && state.academicPeriodId && state.attendanceDate);
  const canSave = state.loaded && !state.saving;

  return {
    ...state,
    teacherSubjectSectionOptions,
    academicPeriodOptions,
    attendanceStatusOptions,
    absenceTypeOptions,
    isLoading: loadingTSS || loadingPeriods || loadingStatuses || loadingAbsenceTypes,
    canLoad, canSave,
    setTeacherSubjectSectionId, setAcademicPeriodId, setAttendanceDate,
    updateRosterEntry, loadRoster, saveAttendance,
  };
};
