import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { incidentTypeService } from "./incident-type.service";
import { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, selectIncidentTypes, selectIncidentTypesStatus, selectIncidentTypesError } from "./incident-type.slice";
import type { IncidentTypeCreateDataT, IncidentTypeCreateParamsT, IncidentTypeDeleteParamsT, IncidentTypeFormValues, IncidentTypeListParamsT, IncidentTypeT, IncidentTypeUpdateParamsT } from "./incident-type.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null; };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useIncidentTypeController = () => {
  const dispatch = useAppDispatch();
  const incidentTypes = useAppSelector(selectIncidentTypes);
  const status = useAppSelector(selectIncidentTypesStatus);
  const error = useAppSelector(selectIncidentTypesError);

  const loadIncidentTypes = useCallback(async (params?: IncidentTypeListParamsT) => {
    dispatch(loadPending());
    try { const items = await incidentTypeService.list(params ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); }
    catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar tipos de incidente")); }
  }, [dispatch]);

  const create = useCallback(async (data: IncidentTypeCreateParamsT): Promise<IncidentTypeT> => {
    try { const created = await incidentTypeService.create(data); dispatch(entityCreated(created)); return created; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const update = useCallback(async (params: IncidentTypeUpdateParamsT): Promise<IncidentTypeT> => {
    try { const updated = await incidentTypeService.update(params); dispatch(entityUpdated(updated)); return updated; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const remove = useCallback(async (id: IncidentTypeDeleteParamsT): Promise<void> => {
    try { const { id: deletedId } = await incidentTypeService.softDelete(id); dispatch(entityDeleted(deletedId)); }
    catch (err) { dispatch(mutationError(err instanceof Error ? err.message : "Error al eliminar tipo de incidente")); }
  }, [dispatch]);

  return { incidentTypes, isLoading: status === "loading", error, loadIncidentTypes, createIncidentType: create, updateIncidentType: update, deleteIncidentType: remove };
};

export type IncidentTypeControllerT = ReturnType<typeof useIncidentTypeController>;

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

const unwrapCreate = async (data: IncidentTypeCreateDataT, create: IncidentTypeControllerT["createIncidentType"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: IncidentTypeUpdateParamsT, update: IncidentTypeControllerT["updateIncidentType"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: IncidentTypeControllerT["createIncidentType"]; update: IncidentTypeControllerT["updateIncidentType"]; }

export const useIncidentTypeForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIncidentType, setEditingIncidentType] = useState<IncidentTypeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editingIncidentType;

  const openModal = useCallback((incidentType?: IncidentTypeT) => { setEditingIncidentType(incidentType ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditingIncidentType(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const handleSubmit = useCallback(async (values: IncidentTypeFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editingIncidentType) {
      const { code, name, description, is_active } = values;
      const result = await unwrapUpdate({ id: editingIncidentType.id, data: { code, name, description, is_active } }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const { code, name, description } = values;
      const result = await unwrapCreate({ code, name, description }, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editingIncidentType, create, update, closeModal]);

  return { isOpen, isEdit, editingIncidentType, submitErrors, openModal, closeModal, handleSubmit };
};
