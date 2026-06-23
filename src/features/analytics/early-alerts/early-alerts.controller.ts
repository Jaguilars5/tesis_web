import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { earlyAlertService } from "./early-alerts.service";
import {
  loadError, loadPending, loadSuccess, mutationError,
  entityCreated, entityDeleted, entityUpdated,
  selectError, selectItems, selectStatus,
} from "./early-alerts.slice";
import type {
  EarlyAlertCreateDataT,
  EarlyAlertCreateParamsT,
  EarlyAlertDeleteParamsT,
  EarlyAlertFormValues,
  EarlyAlertListParamsT,
  EarlyAlertT,
  EarlyAlertUpdateDataT,
  EarlyAlertUpdateParamsT,
} from "./early-alerts.types";
import type { CreateRejectValue } from "./early-alerts.utils";

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useEarlyAlertController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(async (params?: EarlyAlertListParamsT) => {
    dispatch(loadPending());
    try {
      const items = await earlyAlertService.list(params ?? { page: 1, pageSize: 100 });
      dispatch(loadSuccess(items));
    } catch (err) {
      dispatch(loadError(err instanceof Error ? err.message : "Error al cargar alertas tempranas"));
    }
  }, [dispatch]);

  const create = useCallback(async (data: EarlyAlertCreateParamsT): Promise<EarlyAlertT> => {
    try {
      const created = await earlyAlertService.create(data);
      dispatch(entityCreated(created));
      return created;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const update = useCallback(async (params: EarlyAlertUpdateParamsT): Promise<EarlyAlertT> => {
    try {
      const updated = await earlyAlertService.update(params);
      dispatch(entityUpdated(updated));
      return updated;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const remove = useCallback(async (id: EarlyAlertDeleteParamsT): Promise<void> => {
    try {
      const { id: deletedId } = await earlyAlertService.softDelete(id);
      dispatch(entityDeleted(deletedId));
    } catch (err) {
      dispatch(mutationError(err instanceof Error ? err.message : "Error al eliminar alerta"));
    }
  }, [dispatch]);

  const markAttended = useCallback(async (id: number, response_actions: string): Promise<EarlyAlertT> => {
    try {
      const updated = await earlyAlertService.markAttended({ id, response_actions });
      dispatch(entityUpdated(updated));
      return updated;
    } catch (err) {
      dispatch(mutationError(err instanceof Error ? err.message : "Error al marcar como atendida"));
      throw err;
    }
  }, [dispatch]);

  return { items, isLoading: status === "loading", error, loadItems, create, update, remove, markAttended };
};

export type EarlyAlertControllerT = ReturnType<typeof useEarlyAlertController>;

export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

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

const unwrapCreate = async (data: EarlyAlertCreateDataT, create: EarlyAlertControllerT["create"]) => {
  try {
    return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState };
  } catch (error) {
    const parsed = extractError(error);
    return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState };
  }
};

const unwrapUpdate = async (params: EarlyAlertUpdateParamsT, update: EarlyAlertControllerT["update"]) => {
  try {
    return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState };
  } catch (error) {
    const parsed = extractError(error);
    return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState };
  }
};

interface UseEarlyAlertFormArgs { create: EarlyAlertControllerT["create"]; update: EarlyAlertControllerT["update"]; }

export const useEarlyAlertForm = ({ create, update }: UseEarlyAlertFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EarlyAlertT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editing;

  const openModal = useCallback((entity?: EarlyAlertT) => { setEditing(entity ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditing(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const handleSubmit = useCallback(async (values: EarlyAlertFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editing) {
      const data: EarlyAlertUpdateDataT = {
        ...values,
        alert_type: values.alert_type || null,
        urgency_level: values.urgency_level || null,
      };
      const result = await unwrapUpdate({ id: editing.id, data }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const { enrollment, academic_period, alert_type, description, urgency_level, response_actions } = values;
      const result = await unwrapCreate({
        enrollment, academic_period,
        alert_type: alert_type || null,
        description,
        urgency_level: urgency_level || null,
        response_actions,
      }, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editing, create, update, closeModal]);

  return { isOpen, isEdit, editing, submitErrors, openModal, closeModal, handleSubmit };
};
