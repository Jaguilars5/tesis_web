import { useCallback, useEffect, useMemo, useState } from "react";
import { classScheduleService } from "@features/academic/class-schedule";
import { useTeacherSubjectSectionOptions } from "@features/attendance/attendance";
import { useAcademicPeriodOptions } from "@features/attendance/attendance";
import { useAttendanceStatusOptions } from "@features/attendance/attendance";
import { useAbsenceTypeOptions } from "@features/attendance/attendance";

import {
  buildValidDateOptions,
  formatAllowedDays,
  getIsoWeekday,
} from "../take-attendance.utils";
import { takeAttendanceService } from "../take-attendance.service";

import type {
  RosterEntryT,
  TakeAttendanceStateT,
  TakeByScheduleSavePayloadT,
  TakeByScheduleSaveResultT,
} from "../take-attendance.types";

const initialState: TakeAttendanceStateT = {
  teacherSubjectSectionId: null,
  academicPeriodId: null,
  attendanceDate: new Date().toISOString().split("T")[0],
  schedules: [],
  allowedDays: [],
  selectedScheduleId: null,
  loadingSchedule: false,
  roster: [],
  loadingRoster: false,
  saving: false,
  loaded: false,
  error: null,
  success: false,
};

export const useTakeAttendanceController = () => {
  const { teacherSubjectSectionOptions, loading: loadingTSS } =
    useTeacherSubjectSectionOptions();
  const { academicPeriodOptions, loading: loadingPeriods } =
    useAcademicPeriodOptions();
  const { attendanceStatusOptions, loading: loadingStatuses } =
    useAttendanceStatusOptions();
  const { absenceTypeOptions, loading: loadingAbsenceTypes } =
    useAbsenceTypeOptions();

  const [state, setState] = useState<TakeAttendanceStateT>(initialState);

  useEffect(() => {
    if (academicPeriodOptions.length > 0 && state.academicPeriodId === null) {
      const today = new Date().toISOString().split("T")[0];
      const matched = academicPeriodOptions.find(
        (opt) =>
          opt.startDate &&
          opt.endDate &&
          today >= opt.startDate &&
          today <= opt.endDate,
      );
      const targetId = matched
        ? Number(matched.value)
        : Number(academicPeriodOptions[0].value);
      setState((prev) => ({ ...prev, academicPeriodId: targetId }));
    }
  }, [academicPeriodOptions, state.academicPeriodId]);

  useEffect(() => {
    const tssId = state.teacherSubjectSectionId;
    if (!tssId) {
      setState((prev) => ({
        ...prev,
        schedules: [],
        allowedDays: [],
        loadingSchedule: false,
      }));
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loadingSchedule: true }));

    classScheduleService
      .list({ pageSize: 100, filters: { teacher_subject_section: tssId } })
      .then((schedules) => {
        if (cancelled) return;
        const classSchedules = schedules.filter(
          (s) => s.teacher_subject_section === tssId,
        );
        const allowedDays = [
          ...new Set(classSchedules.map((s) => s.day_of_week)),
        ];
        setState((prev) => ({
          ...prev,
          schedules: classSchedules,
          allowedDays,
          loadingSchedule: false,
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          schedules: [],
          allowedDays: [],
          loadingSchedule: false,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [state.teacherSubjectSectionId]);

  const setTeacherSubjectSectionId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      teacherSubjectSectionId: id,
      loaded: false,
      roster: [],
      schedules: [],
      allowedDays: [],
      selectedScheduleId: null,
      success: false,
    }));
  }, []);

  const setAcademicPeriodId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      academicPeriodId: id,
      loaded: false,
      roster: [],
      success: false,
    }));
  }, []);

  const setAttendanceDate = useCallback((date: string) => {
    setState((prev) => ({
      ...prev,
      attendanceDate: date,
      loaded: false,
      roster: [],
      success: false,
    }));
  }, []);

  const setSelectedScheduleId = useCallback((id: number | null) => {
    setState((prev) => ({
      ...prev,
      selectedScheduleId: id,
      loaded: false,
      roster: [],
      success: false,
    }));
  }, []);

  const updateRosterEntry = useCallback(
    (
      enrollmentId: number,
      updates: Partial<Omit<RosterEntryT, "enrollmentId" | "studentName">>,
    ) => {
      setState((prev) => ({
        ...prev,
        roster: prev.roster.map((entry) =>
          entry.enrollmentId === enrollmentId
            ? { ...entry, ...updates }
            : entry,
        ),
      }));
    },
    [],
  );

  const selectedPeriod = useMemo(
    () =>
      academicPeriodOptions.find(
        (opt) => Number(opt.value) === state.academicPeriodId,
      ),
    [academicPeriodOptions, state.academicPeriodId],
  );

  const allowedDaysLabel = useMemo(
    () => formatAllowedDays(state.allowedDays),
    [state.allowedDays],
  );

  const dateOptions = useMemo(
    () =>
      buildValidDateOptions(
        selectedPeriod?.startDate ?? "",
        selectedPeriod?.endDate ?? "",
        state.allowedDays,
      ),
    [selectedPeriod, state.allowedDays],
  );

  const isDateValid = dateOptions.some(
    (opt) => opt.value === state.attendanceDate,
  );

  useEffect(() => {
    if (dateOptions.length === 0) return;
    if (dateOptions.some((opt) => opt.value === state.attendanceDate)) return;
    setState((prev) => ({
      ...prev,
      attendanceDate: dateOptions[0].value,
      loaded: false,
      roster: [],
      success: false,
    }));
  }, [dateOptions, state.attendanceDate]);

  const schedulesForDate = useMemo(() => {
    const isoDay = getIsoWeekday(state.attendanceDate);
    if (isoDay === null) return [];
    return state.schedules
      .filter((s) => s.day_of_week === isoDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [state.schedules, state.attendanceDate]);

  const scheduleOptions = useMemo(
    () =>
      schedulesForDate.map((s) => ({
        value: String(s.id),
        label: `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`,
      })),
    [schedulesForDate],
  );

  useEffect(() => {
    const validIds = schedulesForDate.map((s) => s.id);
    setState((prev) => {
      if (prev.selectedScheduleId && validIds.includes(prev.selectedScheduleId)) {
        return prev;
      }
      const next = validIds.length === 1 ? validIds[0] : null;
      if (next === prev.selectedScheduleId) return prev;
      return {
        ...prev,
        selectedScheduleId: next,
        loaded: false,
        roster: [],
        success: false,
      };
    });
  }, [schedulesForDate]);

  const dateError = useMemo(() => {
    if (!state.teacherSubjectSectionId || state.loadingSchedule) return null;
    if (state.allowedDays.length === 0) {
      return "Esta clase no tiene un horario configurado. Configure el horario para poder tomar asistencia.";
    }
    if (dateOptions.length === 0) {
      return `No hay fechas de clase disponibles en el período seleccionado. Días con clase: ${allowedDaysLabel}.`;
    }
    return null;
  }, [
    state.teacherSubjectSectionId,
    state.loadingSchedule,
    state.allowedDays,
    dateOptions,
    allowedDaysLabel,
  ]);

  const loadRoster = useCallback(async () => {
    const {
      teacherSubjectSectionId,
      academicPeriodId,
      attendanceDate,
      selectedScheduleId,
    } = state;
    if (!teacherSubjectSectionId || !academicPeriodId || !attendanceDate)
      return;
    if (!isDateValid) {
      setState((prev) => ({
        ...prev,
        error: "La fecha seleccionada no corresponde al horario de la clase.",
      }));
      return;
    }
    if (!selectedScheduleId) {
      setState((prev) => ({
        ...prev,
        error: "Seleccione el bloque horario de la clase.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loadingRoster: true,
      error: null,
      loaded: false,
      success: false,
    }));

    try {
      const response = await takeAttendanceService.getRoster({
        classScheduleId: selectedScheduleId,
        date: attendanceDate,
      });

      const roster: RosterEntryT[] = response.students.map((s) => ({
        enrollmentId: s.enrollment_id,
        studentName: s.student_name,
        attendanceId: s.attendance?.id ?? null,
        attendanceStatusId: s.attendance?.attendance_status ?? null,
        absenceTypeId: s.attendance?.absence_type ?? null,
        observation: s.attendance?.observation ?? "",
      }));

      setState((prev) => ({
        ...prev,
        roster,
        loadingRoster: false,
        loaded: true,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loadingRoster: false,
        error:
          err instanceof Error ? err.message : "Error al cargar estudiantes",
      }));
    }
  }, [
    state.teacherSubjectSectionId,
    state.academicPeriodId,
    state.attendanceDate,
    state.selectedScheduleId,
    isDateValid,
  ]);

  const saveAttendance = useCallback(async () => {
    const {
      teacherSubjectSectionId,
      academicPeriodId,
      attendanceDate,
      selectedScheduleId,
      roster,
    } = state;
    if (
      !teacherSubjectSectionId ||
      !academicPeriodId ||
      !attendanceDate ||
      !selectedScheduleId
    )
      return;

    const records = roster
      .filter((entry) => entry.attendanceStatusId !== null)
      .map((entry) => ({
        enrollment: entry.enrollmentId,
        attendance_status: entry.attendanceStatusId as number,
        absence_type: entry.absenceTypeId,
        observation: entry.observation,
      }));

    if (records.length === 0) {
      setState((prev) => ({
        ...prev,
        error: "Marque al menos un estudiante antes de guardar.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      saving: true,
      error: null,
      success: false,
    }));

    try {
      const payload: TakeByScheduleSavePayloadT = {
        class_schedule_id: selectedScheduleId,
        date: attendanceDate,
        academic_period: academicPeriodId,
        teacher_subject_section: teacherSubjectSectionId,
        records,
      };

      const result: TakeByScheduleSaveResultT =
        await takeAttendanceService.saveAttendance(payload);

      const failed = Array.isArray(result) ? [] : (result?.errors ?? []);
      if (failed.length > 0) {
        const detail = [
          ...new Set(failed.map((f) => String(f.error).trim()).filter(Boolean)),
        ].join(" | ");
        setState((prev) => ({
          ...prev,
          saving: false,
          success: false,
          error: `No se pudieron guardar ${failed.length} de ${records.length} registros.${detail ? ` Motivo: ${detail}` : ""}`,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        saving: false,
        success: true,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error:
          err instanceof Error ? err.message : "Error al guardar asistencias",
        success: false,
      }));
    }
  }, [
    state.teacherSubjectSectionId,
    state.academicPeriodId,
    state.attendanceDate,
    state.selectedScheduleId,
    state.roster,
  ]);

  const canLoad = !!(
    state.teacherSubjectSectionId &&
    state.academicPeriodId &&
    state.attendanceDate &&
    state.selectedScheduleId &&
    !state.loadingSchedule &&
    isDateValid
  );
  const canSave = state.loaded && !state.saving;

  return {
    ...state,
    teacherSubjectSectionOptions,
    academicPeriodOptions,
    attendanceStatusOptions,
    absenceTypeOptions,
    dateOptions,
    scheduleOptions,
    isLoading:
      loadingTSS || loadingPeriods || loadingStatuses || loadingAbsenceTypes,
    canLoad,
    canSave,
    dateError,
    allowedDaysLabel,
    setTeacherSubjectSectionId,
    setAcademicPeriodId,
    setAttendanceDate,
    setSelectedScheduleId,
    updateRosterEntry,
    loadRoster,
    saveAttendance,
  };
};
