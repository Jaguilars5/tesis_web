import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { absenceTypeService } from "./absence-type.service";
import {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError,
  selectAbsenceTypes, selectAbsenceTypesStatus, selectAbsenceTypesError,
} from "./absence-type.slice";
import type {
  AbsenceTypeCreateDataT, AbsenceTypeCreateParamsT, AbsenceTypeDeleteParamsT,
  AbsenceTypeFormValues, AbsenceTypeListParamsT, AbsenceTypeT, AbsenceTypeUpdateParamsT,
} from "./absence-type.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useAbsenceTypeController = () => {
  const dispatch = useAppDispatch();
  const absenceTypes = useAppSelector(selectAbsenceTypes);
  const status = useAppSelector(selectAbsenceTypesStatus);
  const error = useAppSelector(selectAbsenceTypesError);

  const loadAbsenceTypes = useCallback(async (params?: AbsenceTypeListParamsT) => {
    dispatch(loadPending());
    try {
      const items = await absenceTypeService.list(params ?? { page: 1, pageSize: 100 });
      dispatch(loadSuccess(items));
    } catch (err) {
      dispatch(loadError(err instanceof Error ? err.message : "Error al cargar tipos de ausencia"));
    }
  }, [dispatch]);

  const create = useCallback(async (data: AbsenceTypeCreateParamsT): Promise<AbsenceTypeT> => {
    try {
      const created = await absenceTypeService.create(data);
      dispatch(entityCreated(created));
      return created;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const update = useCallback(async (params: AbsenceTypeUpdateParamsT): Promise<AbsenceTypeT> => {
    try {
      const updated = await absenceTypeService.update(params);
      dispatch(entityUpdated(updated));
      return updated;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const remove = useCallback(async (id: AbsenceTypeDeleteParamsT): Promise<void> => {
    try {
      const { id: deletedId } = await absenceTypeService.delete(id);
      dispatch(entityDeleted(deletedId));
    } catch (err) {
      dispatch(mutationError(err instanceof Error ? err.message : "Error al eliminar tipo de ausencia"));
    }
  }, [dispatch]);

  return { absenceTypes, isLoading: status === "loading", error, loadAbsenceTypes, createAbsenceType: create, updateAbsenceType: update, deleteAbsenceType: remove };
};

export type AbsenceTypeControllerT = ReturnType<typeof useAbsenceTypeController>;

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

const unwrapCreate = async (data: AbsenceTypeCreateDataT, create: AbsenceTypeControllerT["createAbsenceType"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: AbsenceTypeUpdateParamsT, update: AbsenceTypeControllerT["updateAbsenceType"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: AbsenceTypeControllerT["createAbsenceType"]; update: AbsenceTypeControllerT["updateAbsenceType"]; }

export const useAbsenceTypeForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAbsenceType, setEditingAbsenceType] = useState<AbsenceTypeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editingAbsenceType;

  const openModal = useCallback((absenceType?: AbsenceTypeT) => {
    setEditingAbsenceType(absenceType ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAbsenceType(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(async (values: AbsenceTypeFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editingAbsenceType) {
      const { code, name, description, is_active } = values;
      const result = await unwrapUpdate({ id: editingAbsenceType.id, data: { code, name, description, is_active } }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const { code, name, description } = values;
      const result = await unwrapCreate({ code, name, description }, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editingAbsenceType, create, update, closeModal]);

  return { isOpen, isEdit, editingAbsenceType, submitErrors, openModal, closeModal, handleSubmit };
};
