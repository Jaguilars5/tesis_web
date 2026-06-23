import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { severityService } from "./severity.service";
import { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, selectSeverities, selectSeveritiesStatus, selectSeveritiesError } from "./severity.slice";
import type { SeverityCreateDataT, SeverityCreateParamsT, SeverityDeleteParamsT, SeverityFormValues, SeverityListParamsT, SeverityT, SeverityUpdateParamsT } from "./severity.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null; };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useSeverityController = () => {
  const dispatch = useAppDispatch(); const severities = useAppSelector(selectSeverities);
  const status = useAppSelector(selectSeveritiesStatus); const error = useAppSelector(selectSeveritiesError);
  const loadSeverities = useCallback(async (params?: SeverityListParamsT) => { dispatch(loadPending()); try { const items = await severityService.list(params ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); } catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar severidades")); } }, [dispatch]);
  const create = useCallback(async (data: SeverityCreateParamsT): Promise<SeverityT> => { try { const created = await severityService.create(data); dispatch(entityCreated(created)); return created; } catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; } }, [dispatch]);
  const update = useCallback(async (params: SeverityUpdateParamsT): Promise<SeverityT> => { try { const updated = await severityService.update(params); dispatch(entityUpdated(updated)); return updated; } catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; } }, [dispatch]);
  const remove = useCallback(async (id: SeverityDeleteParamsT): Promise<void> => { try { const { id: deletedId } = await severityService.softDelete(id); dispatch(entityDeleted(deletedId)); } catch (err) { dispatch(mutationError(err instanceof Error ? err.message : "Error al eliminar severidad")); } }, [dispatch]);
  return { severities, isLoading: status === "loading", error, loadSeverities, createSeverity: create, updateSeverity: update, deleteSeverity: remove };
};

export type SeverityControllerT = ReturnType<typeof useSeverityController>;

const extractError = (error: unknown) => {
  if (error && typeof error === "object" && "msg" in error && typeof (error as { msg?: unknown }).msg === "string") {
    const obj = error as CreateRejectValue; const fieldErrors: ValidationErrors = {}; const general: string[] = [];
    if (obj.data && typeof obj.data === "object") { for (const [key, value] of Object.entries(obj.data)) { if (typeof value === "string") fieldErrors[key] = value; else general.push(`${key}: ${value}`); } }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) general.push(obj.msg);
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

const unwrapCreate = async (data: SeverityCreateDataT, create: SeverityControllerT["createSeverity"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: SeverityUpdateParamsT, update: SeverityControllerT["updateSeverity"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: SeverityControllerT["createSeverity"]; update: SeverityControllerT["updateSeverity"]; }

export const useSeverityForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false); const [editingSeverity, setEditingSeverity] = useState<SeverityT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} }); const isEdit = !!editingSeverity;
  const openModal = useCallback((severity?: SeverityT) => { setEditingSeverity(severity ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditingSeverity(null); setSubmitErrors({ general: [], validation: {} }); }, []);
  const handleSubmit = useCallback(async (values: SeverityFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editingSeverity) { const { code, name, description, is_active } = values; const result = await unwrapUpdate({ id: editingSeverity.id, data: { code, name, description, is_active } }, update); if (result.ok) { closeModal(); return; } setSubmitErrors(result.errors); }
    else { const { code, name, description } = values; const result = await unwrapCreate({ code, name, description }, create); if (result.ok) { closeModal(); return; } setSubmitErrors(result.errors); }
  }, [editingSeverity, create, update, closeModal]);
  return { isOpen, isEdit, editingSeverity, submitErrors, openModal, closeModal, handleSubmit };
};
