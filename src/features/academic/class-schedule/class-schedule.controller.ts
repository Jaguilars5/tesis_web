import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { classScheduleService } from "./class-schedule.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  scheduleCreated,
  scheduleDeleted,
  scheduleUpdated,
  selectClassScheduleError,
  selectClassSchedules,
  selectClassSchedulesStatus,
} from "./class-schedule.slice";
import type {
  ClassScheduleCreateParamsT,
  ClassScheduleDeleteParamsT,
  ClassScheduleFormValues,
  ClassScheduleListParamsT,
  ClassScheduleT,
  ClassScheduleUpdateParamsT,
} from "./class-schedule.types";

export type CreateScheduleRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateScheduleRejectValue => {
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

export const useClassScheduleController = () => {
  const dispatch = useAppDispatch();
  const classSchedules = useAppSelector(selectClassSchedules);
  const status = useAppSelector(selectClassSchedulesStatus);
  const error = useAppSelector(selectClassScheduleError);

  const loadClassSchedules = useCallback(
    async (params?: ClassScheduleListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await classScheduleService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error
              ? err.message
              : "Error al cargar horarios académicos",
          ),
        );
      }
    },
    [dispatch],
  );

  const createClassSchedule = useCallback(
    async (data: ClassScheduleCreateParamsT): Promise<ClassScheduleT> => {
      try {
        const created = await classScheduleService.create(data);
        dispatch(scheduleCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateClassSchedule = useCallback(
    async (params: ClassScheduleUpdateParamsT): Promise<ClassScheduleT> => {
      try {
        const updated = await classScheduleService.update(params);
        dispatch(scheduleUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteClassSchedule = useCallback(
    async (id: ClassScheduleDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await classScheduleService.softDelete(id);
        dispatch(scheduleDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error
              ? err.message
              : "Error al eliminar horario académico",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    classSchedules,
    isLoading: status === "loading",
    error,
    loadClassSchedules,
    createClassSchedule,
    updateClassSchedule,
    deleteClassSchedule,
  };
};

export type ClassScheduleControllerT = ReturnType<
  typeof useClassScheduleController
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
    const obj = error as CreateScheduleRejectValue;
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
  data: ClassScheduleCreateParamsT,
  create: ClassScheduleControllerT["createClassSchedule"],
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
  params: ClassScheduleUpdateParamsT,
  update: ClassScheduleControllerT["updateClassSchedule"],
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

interface UseClassScheduleFormArgs {
  create: ClassScheduleControllerT["createClassSchedule"];
  update: ClassScheduleControllerT["updateClassSchedule"];
}

export const useClassScheduleForm = ({
  create,
  update,
}: UseClassScheduleFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingClassSchedule, setEditingClassSchedule] =
    useState<ClassScheduleT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingClassSchedule;

  const openModal = useCallback((classSchedule?: ClassScheduleT) => {
    setEditingClassSchedule(classSchedule ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingClassSchedule(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleCreate = useCallback(
    async (values: ClassScheduleFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { teacher_subject_section, day_of_week, start_time, end_time } =
        values;
      const result = await unwrapCreate(
        { teacher_subject_section, day_of_week, start_time, end_time },
        create,
      );
      if (result.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(result.errors);
    },
    [create, closeModal],
  );

  const handleUpdate = useCallback(
    async (values: ClassScheduleFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (!editingClassSchedule) {
        setSubmitErrors({
          general: ["No hay horario en edición"],
          validation: {},
        });
        return;
      }
      const result = await unwrapUpdate(
        { id: editingClassSchedule.id, data: values },
        update,
      );
      if (result.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(result.errors);
    },
    [editingClassSchedule, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingClassSchedule,
    submitErrors,
    openModal,
    closeModal,
    handleCreate,
    handleUpdate,
  };
};
