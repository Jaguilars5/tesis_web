import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { periodTypeService } from "./period-types.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  periodTypeCreated,
  periodTypeDeleted,
  periodTypeUpdated,
  selectPeriodTypeError,
  selectPeriodTypes,
  selectPeriodTypesStatus,
} from "./period-types.slice";
import type {
  PeriodTypeCreateDataT,
  PeriodTypeCreateParamsT,
  PeriodTypeDeleteParamsT,
  PeriodTypeFormValues,
  PeriodTypeListParamsT,
  PeriodTypeT,
  PeriodTypeUpdateParamsT,
} from "./period-types.types";

export type CreatePeriodTypeRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreatePeriodTypeRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause =
    error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })
    ?.response?.data;
  return {
    msg,
    data: (responseData?.data as Record<string, string> | null) ?? null,
  };
};

export const usePeriodTypeController = () => {
  const dispatch = useAppDispatch();
  const periodTypes = useAppSelector(selectPeriodTypes);
  const status = useAppSelector(selectPeriodTypesStatus);
  const error = useAppSelector(selectPeriodTypeError);

  const loadPeriodTypes = useCallback(
    async (params?: PeriodTypeListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await periodTypeService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error
              ? err.message
              : "Error al cargar tipos de periodo",
          ),
        );
      }
    },
    [dispatch],
  );

  const createPeriodType = useCallback(
    async (data: PeriodTypeCreateParamsT): Promise<PeriodTypeT> => {
      try {
        const created = await periodTypeService.create(data);
        dispatch(periodTypeCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updatePeriodType = useCallback(
    async (params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT> => {
      try {
        const updated = await periodTypeService.update(params);
        dispatch(periodTypeUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deletePeriodType = useCallback(
    async (id: PeriodTypeDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await periodTypeService.softDelete(id);
        dispatch(periodTypeDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error
              ? err.message
              : "Error al eliminar tipo de periodo",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    periodTypes,
    isLoading: status === "loading",
    error,
    loadPeriodTypes,
    createPeriodType,
    updatePeriodType,
    deletePeriodType,
  };
};

export type PeriodTypeControllerT = ReturnType<
  typeof usePeriodTypeController
>;

export type ValidationErrors = Record<string, string>;

export interface SubmitErrorState {
  general: string[];
  validation: ValidationErrors;
}

const extractError = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "msg" in error &&
    typeof (error as { msg?: unknown }).msg === "string"
  ) {
    const obj = error as CreatePeriodTypeRejectValue;
    const fieldErrors: ValidationErrors = {};
    const general: string[] = [];
    if (obj.data && typeof obj.data === "object") {
      for (const [key, value] of Object.entries(obj.data)) {
        if (typeof value === "string") {
          fieldErrors[key] = value;
        } else {
          general.push(`${key}: ${value}`);
        }
      }
    }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) {
      general.push(obj.msg);
    }
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

const unwrapCreate = async (
  data: PeriodTypeCreateDataT,
  create: PeriodTypeControllerT["createPeriodType"],
) => {
  try {
    return {
      ok: true as const,
      result: await create(data),
      errors: { general: [], validation: {} } as SubmitErrorState,
    };
  } catch (error) {
    const parsed = extractError(error);
    return {
      ok: false as const,
      result: null,
      errors: {
        general: parsed.general,
        validation: parsed.validation,
      } as SubmitErrorState,
    };
  }
};

const unwrapUpdate = async (
  params: PeriodTypeUpdateParamsT,
  update: PeriodTypeControllerT["updatePeriodType"],
) => {
  try {
    return {
      ok: true as const,
      result: await update(params),
      errors: { general: [], validation: {} } as SubmitErrorState,
    };
  } catch (error) {
    const parsed = extractError(error);
    return {
      ok: false as const,
      result: null,
      errors: {
        general: parsed.general,
        validation: parsed.validation,
      } as SubmitErrorState,
    };
  }
};

interface UsePeriodTypeFormArgs {
  create: PeriodTypeControllerT["createPeriodType"];
  update: PeriodTypeControllerT["updatePeriodType"];
}

export const usePeriodTypeForm = ({
  create,
  update,
}: UsePeriodTypeFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPeriodType, setEditingPeriodType] =
    useState<PeriodTypeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingPeriodType;

  const openModal = useCallback((periodType?: PeriodTypeT) => {
    setEditingPeriodType(periodType ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingPeriodType(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: PeriodTypeFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editingPeriodType) {
        const result = await unwrapUpdate(
          { id: editingPeriodType.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { code, name, description, divisions_per_year } = values;
        const result = await unwrapCreate(
          { code, name, description, divisions_per_year },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingPeriodType, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingPeriodType,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
