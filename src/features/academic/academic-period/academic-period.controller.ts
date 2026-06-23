import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { academicPeriodService } from "./academic-period.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  periodCreated,
  periodDeleted,
  periodUpdated,
  selectAcademicPeriodError,
  selectAcademicPeriods,
  selectAcademicPeriodsStatus,
} from "./academic-period.slice";
import type {
  AcademicPeriodCreateDataT,
  AcademicPeriodCreateParamsT,
  AcademicPeriodDeleteParamsT,
  AcademicPeriodFormValues,
  AcademicPeriodListParamsT,
  AcademicPeriodT,
  AcademicPeriodUpdateParamsT,
} from "./academic-period.types";


export type CreatePeriodRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreatePeriodRejectValue => {
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

export const useAcademicPeriodController = () => {
  const dispatch = useAppDispatch();
  const academicPeriods = useAppSelector(selectAcademicPeriods);
  const status = useAppSelector(selectAcademicPeriodsStatus);
  const error = useAppSelector(selectAcademicPeriodError);

  const loadAcademicPeriods = useCallback(
    async (params?: AcademicPeriodListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await academicPeriodService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error
              ? err.message
              : "Error al cargar periodos academicos",
          ),
        );
      }
    },
    [dispatch],
  );

  const createAcademicPeriod = useCallback(
    async (data: AcademicPeriodCreateParamsT): Promise<AcademicPeriodT> => {
      try {
        const created = await academicPeriodService.create(data);
        dispatch(periodCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateAcademicPeriod = useCallback(
    async (params: AcademicPeriodUpdateParamsT): Promise<AcademicPeriodT> => {
      try {
        const updated = await academicPeriodService.update(params);
        dispatch(periodUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteAcademicPeriod = useCallback(
    async (id: AcademicPeriodDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await academicPeriodService.softDelete(id);
        dispatch(periodDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error
              ? err.message
              : "Error al eliminar periodo academico",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    academicPeriods,
    isLoading: status === "loading",
    error,
    loadAcademicPeriods,
    createAcademicPeriod,
    updateAcademicPeriod,
    deleteAcademicPeriod,
  };
};

export type AcademicPeriodControllerT = ReturnType<
  typeof useAcademicPeriodController
>;


export type ValidationErrors = Record<string, string>;

export interface SubmitErrorState {
  general: string[];
  validation: ValidationErrors;
}

const extractError = (error: unknown) => {
  // Caso 1: objeto serializable { msg, data } lanzado por el controlador
  if (
    error &&
    typeof error === "object" &&
    "msg" in error &&
    typeof (error as { msg?: unknown }).msg === "string"
  ) {
    const obj = error as CreatePeriodRejectValue;
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
  data: AcademicPeriodCreateDataT,
  create: AcademicPeriodControllerT["createAcademicPeriod"],
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
  params: AcademicPeriodUpdateParamsT,
  update: AcademicPeriodControllerT["updateAcademicPeriod"],
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

interface UseAcademicPeriodFormArgs {
  create: AcademicPeriodControllerT["createAcademicPeriod"];
  update: AcademicPeriodControllerT["updateAcademicPeriod"];
}

export const useAcademicPeriodForm = ({
  create,
  update,
}: UseAcademicPeriodFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAcademicPeriod, setEditingAcademicPeriod] =
    useState<AcademicPeriodT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingAcademicPeriod;

  const openModal = useCallback((academicPeriod?: AcademicPeriodT) => {
    setEditingAcademicPeriod(academicPeriod ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAcademicPeriod(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleCreateMany = useCallback(
    async (items: AcademicPeriodCreateDataT[]) => {
      setSubmitErrors({ general: [], validation: {} });
      if (items.length === 0) {
        closeModal();
        return;
      }

      const settled = await Promise.all(
        items.map((data) => unwrapCreate(data, create)),
      );

      const allOk = settled.every((r) => r.ok);
      if (allOk) {
        closeModal();
        return;
      }

      // Acumular errores de todos los requests fallidos
      const generalErrors: string[] = [];
      const validationErrors: Record<string, string> = {};

      for (const result of settled) {
        if (!result.ok) {
          generalErrors.push(...result.errors.general);
          Object.assign(validationErrors, result.errors.validation);
        }
      }

      setSubmitErrors({
        general: generalErrors,
        validation: validationErrors,
      });
    },
    [create, closeModal],
  );

  const handleUpdate = useCallback(
    async (values: AcademicPeriodFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (!editingAcademicPeriod) {
        setSubmitErrors({
          general: ["No hay periodo en edición"],
          validation: {},
        });
        return;
      }
      const result = await unwrapUpdate(
        { id: editingAcademicPeriod.id, data: values },
        update,
      );
      if (result.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(result.errors);
    },
    [editingAcademicPeriod, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingAcademicPeriod,
    submitErrors,
    openModal,
    closeModal,
    handleCreateMany,
    handleUpdate,
  };
};
