import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { attendanceService } from "./attendance.service";
import {
  loadPending, loadSuccess, loadError,
  currentAttendanceLoaded,
  attendanceCreated, attendanceUpdated,
  mutationError,
  selectAttendances, selectAttendancesStatus, selectAttendancesError, selectCurrentAttendance,
} from "./attendance.slice";
import type {
  AttendanceCreateDataT, AttendanceCreateParamsT,
  AttendanceFormValues, AttendanceListParamsT, AttendanceT, AttendanceUpdateParamsT,
} from "./attendance.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useAttendanceController = () => {
  const dispatch = useAppDispatch();
  const attendances = useAppSelector(selectAttendances);
  const currentAttendance = useAppSelector(selectCurrentAttendance);
  const status = useAppSelector(selectAttendancesStatus);
  const error = useAppSelector(selectAttendancesError);

  const loadAttendances = useCallback(async (params?: AttendanceListParamsT) => {
    dispatch(loadPending());
    try {
      const items = await attendanceService.list(params ?? { page: 1, pageSize: 100 });
      dispatch(loadSuccess(items));
    } catch (err) {
      dispatch(loadError(err instanceof Error ? err.message : "Error al cargar asistencias"));
    }
  }, [dispatch]);

  const loadAttendance = useCallback(async (id: number) => {
    try {
      const item = await attendanceService.get(id);
      dispatch(currentAttendanceLoaded(item));
    } catch (err) {
      dispatch(loadError(err instanceof Error ? err.message : "Error al cargar asistencia"));
    }
  }, [dispatch]);

  const create = useCallback(async (data: AttendanceCreateParamsT): Promise<AttendanceT> => {
    try {
      const created = await attendanceService.create(data);
      dispatch(attendanceCreated(created));
      return created;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const update = useCallback(async (params: AttendanceUpdateParamsT): Promise<AttendanceT> => {
    try {
      const updated = await attendanceService.update(params);
      dispatch(attendanceUpdated(updated));
      return updated;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  return {
    attendances, currentAttendance,
    isLoading: status === "loading", error,
    loadAttendances, loadAttendance,
    createAttendance: create, updateAttendance: update,
  };
};

export type AttendanceControllerT = ReturnType<typeof useAttendanceController>;

const extractError = (error: unknown) => {
  if (error && typeof error === "object" && "msg" in error && typeof (error as { msg?: unknown }).msg === "string") {
    const obj = error as CreateRejectValue;
    const fieldErrors: ValidationErrors = {};
    const general: string[] = [];
    if (obj.data && typeof obj.data === "object") {
      for (const [key, value] of Object.entries(obj.data)) {
        if (typeof value === "string") fieldErrors[key] = value;
        else general.push(`${key}: ${value}`);
      }
    }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) general.push(obj.msg);
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

const unwrapCreate = async (data: AttendanceCreateDataT, create: AttendanceControllerT["createAttendance"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: AttendanceUpdateParamsT, update: AttendanceControllerT["updateAttendance"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: AttendanceControllerT["createAttendance"]; update: AttendanceControllerT["updateAttendance"]; }

export const useAttendanceForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<AttendanceT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editingAttendance;

  const openModal = useCallback((attendance?: AttendanceT) => {
    setEditingAttendance(attendance ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAttendance(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(async (values: AttendanceFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    const payload = {
      enrollment: values.enrollment!,
      teacher_subject_section: values.teacher_subject_section!,
      academic_period: values.academic_period!,
      attendance_status: values.attendance_status!,
      absence_type: values.absence_type ?? null,
      attendance_date: values.attendance_date,
      observation: values.observation,
    };
    if (editingAttendance) {
      const result = await unwrapUpdate({ id: editingAttendance.id, data: payload }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const result = await unwrapCreate(payload, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editingAttendance, create, update, closeModal]);

  return { isOpen, isEdit, editingAttendance, submitErrors, openModal, closeModal, handleSubmit };
};
