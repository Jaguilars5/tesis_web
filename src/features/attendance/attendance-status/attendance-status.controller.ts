import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { attendanceStatusService } from "./attendance-status.service";
import { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, selectAttendanceStatuses, selectAttendanceStatusesStatus, selectAttendanceStatusesError } from "./attendance-status.slice";
import type { AttendanceStatusCreateDataT, AttendanceStatusCreateParamsT, AttendanceStatusDeleteParamsT, AttendanceStatusFormValues, AttendanceStatusListParamsT, AttendanceStatusT, AttendanceStatusUpdateParamsT } from "./attendance-status.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useAttendanceStatusController = () => {
  const dispatch = useAppDispatch();
  const attendanceStatuses = useAppSelector(selectAttendanceStatuses);
  const status = useAppSelector(selectAttendanceStatusesStatus);
  const error = useAppSelector(selectAttendanceStatusesError);

  const loadAttendanceStatuses = useCallback(async (params?: AttendanceStatusListParamsT) => {
    dispatch(loadPending());
    try { const items = await attendanceStatusService.list(params ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); }
    catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar estados de asistencia")); }
  }, [dispatch]);

  const create = useCallback(async (data: AttendanceStatusCreateParamsT): Promise<AttendanceStatusT> => {
    try { const created = await attendanceStatusService.create(data); dispatch(entityCreated(created)); return created; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const update = useCallback(async (params: AttendanceStatusUpdateParamsT): Promise<AttendanceStatusT> => {
    try { const updated = await attendanceStatusService.update(params); dispatch(entityUpdated(updated)); return updated; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const remove = useCallback(async (id: AttendanceStatusDeleteParamsT): Promise<void> => {
    try { const { id: deletedId } = await attendanceStatusService.delete(id); dispatch(entityDeleted(deletedId)); }
    catch (err) { dispatch(mutationError(err instanceof Error ? err.message : "Error al eliminar estado de asistencia")); }
  }, [dispatch]);

  return { attendanceStatuses, isLoading: status === "loading", error, loadAttendanceStatuses, createAttendanceStatus: create, updateAttendanceStatus: update, deleteAttendanceStatus: remove };
};

export type AttendanceStatusControllerT = ReturnType<typeof useAttendanceStatusController>;

const extractError = (error: unknown) => {
  if (error && typeof error === "object" && "msg" in error && typeof (error as { msg?: unknown }).msg === "string") {
    const obj = error as CreateRejectValue;
    const fieldErrors: ValidationErrors = {}; const general: string[] = [];
    if (obj.data && typeof obj.data === "object") { for (const [key, value] of Object.entries(obj.data)) { if (typeof value === "string") fieldErrors[key] = value; else general.push(`${key}: ${value}`); } }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) general.push(obj.msg);
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

const unwrapCreate = async (data: AttendanceStatusCreateDataT, create: AttendanceStatusControllerT["createAttendanceStatus"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: AttendanceStatusUpdateParamsT, update: AttendanceStatusControllerT["updateAttendanceStatus"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: AttendanceStatusControllerT["createAttendanceStatus"]; update: AttendanceStatusControllerT["updateAttendanceStatus"]; }

export const useAttendanceStatusForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAttendanceStatus, setEditingAttendanceStatus] = useState<AttendanceStatusT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editingAttendanceStatus;

  const openModal = useCallback((attendanceStatus?: AttendanceStatusT) => { setEditingAttendanceStatus(attendanceStatus ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditingAttendanceStatus(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const handleSubmit = useCallback(async (values: AttendanceStatusFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editingAttendanceStatus) {
      const { code, name, description, is_active } = values;
      const result = await unwrapUpdate({ id: editingAttendanceStatus.id, data: { code, name, description, is_active } }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const { code, name, description } = values;
      const result = await unwrapCreate({ code, name, description }, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editingAttendanceStatus, create, update, closeModal]);

  return { isOpen, isEdit, editingAttendanceStatus, submitErrors, openModal, closeModal, handleSubmit };
};
