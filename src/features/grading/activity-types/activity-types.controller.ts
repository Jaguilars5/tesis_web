import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { activityTypeService } from "./activity-types.service";
import { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, selectActivityTypes, selectActivityTypesStatus, selectActivityTypesError } from "./activity-types.slice";
import type { ActivityTypeCreateDataT, ActivityTypeCreateParamsT, ActivityTypeDeleteParamsT, ActivityTypeFormValues, ActivityTypeListParamsT, ActivityTypeT, ActivityTypeUpdateParamsT } from "./activity-types.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null; };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useActivityTypesController = () => {
  const dispatch = useAppDispatch(); const activityTypes = useAppSelector(selectActivityTypes);
  const status = useAppSelector(selectActivityTypesStatus); const error = useAppSelector(selectActivityTypesError);
  const loadActivityTypes = useCallback(async (params?: ActivityTypeListParamsT) => { dispatch(loadPending()); try { const items = await activityTypeService.list(params ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); } catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar tipos de actividad")); } }, [dispatch]);
  const create = useCallback(async (data: ActivityTypeCreateParamsT): Promise<ActivityTypeT> => { try { const created = await activityTypeService.create(data); dispatch(entityCreated(created)); return created; } catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; } }, [dispatch]);
  const update = useCallback(async (params: ActivityTypeUpdateParamsT): Promise<ActivityTypeT> => { try { const updated = await activityTypeService.update(params); dispatch(entityUpdated(updated)); return updated; } catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; } }, [dispatch]);
  const remove = useCallback(async (id: ActivityTypeDeleteParamsT): Promise<void> => { try { const { id: deletedId } = await activityTypeService.softDelete(id); dispatch(entityDeleted(deletedId)); } catch (err) { dispatch(mutationError(err instanceof Error ? err.message : "Error al eliminar tipo de actividad")); } }, [dispatch]);
  return { activityTypes, isLoading: status === "loading", error, loadActivityTypes, createActivityType: create, updateActivityType: update, deleteActivityType: remove };
};

export type ActivityTypesControllerT = ReturnType<typeof useActivityTypesController>;

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

const unwrapCreate = async (data: ActivityTypeCreateDataT, create: ActivityTypesControllerT["createActivityType"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: ActivityTypeUpdateParamsT, update: ActivityTypesControllerT["updateActivityType"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: ActivityTypesControllerT["createActivityType"]; update: ActivityTypesControllerT["updateActivityType"]; }

export const useActivityTypesForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false); const [editingActivityType, setEditingActivityType] = useState<ActivityTypeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} }); const isEdit = !!editingActivityType;
  const openModal = useCallback((activityType?: ActivityTypeT) => { setEditingActivityType(activityType ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditingActivityType(null); setSubmitErrors({ general: [], validation: {} }); }, []);
  const handleSubmit = useCallback(async (values: ActivityTypeFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editingActivityType) { const { code, name, description, is_active } = values; const result = await unwrapUpdate({ id: editingActivityType.id, data: { code, name, description, is_active } }, update); if (result.ok) { closeModal(); return; } setSubmitErrors(result.errors); }
    else { const { code, name, description } = values; const result = await unwrapCreate({ code, name, description }, create); if (result.ok) { closeModal(); return; } setSubmitErrors(result.errors); }
  }, [editingActivityType, create, update, closeModal]);
  return { isOpen, isEdit, editingActivityType, submitErrors, openModal, closeModal, handleSubmit };
};
