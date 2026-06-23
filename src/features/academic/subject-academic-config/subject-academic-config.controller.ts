import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { subjectAcademicConfigService } from "./subject-academic-config.service";
import {
  configCreated,
  configDeleted,
  configUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectSubjectAcademicConfigError,
  selectSubjectAcademicConfigs,
  selectSubjectAcademicConfigsStatus,
} from "./subject-academic-config.slice";
import type {
  SubjectAcademicConfigCreateDataT,
  SubjectAcademicConfigCreateParamsT,
  SubjectAcademicConfigDeleteParamsT,
  SubjectAcademicConfigFormValues,
  SubjectAcademicConfigListParamsT,
  SubjectAcademicConfigT,
  SubjectAcademicConfigUpdateParamsT,
} from "./subject-academic-config.types";

export type CreateSubjectAcademicConfigRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateSubjectAcademicConfigRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return {
    msg,
    data: (responseData?.data as Record<string, string> | null) ?? null,
  };
};

export const useSubjectAcademicConfigController = () => {
  const dispatch = useAppDispatch();
  const subjectAcademicConfigs = useAppSelector(selectSubjectAcademicConfigs);
  const status = useAppSelector(selectSubjectAcademicConfigsStatus);
  const error = useAppSelector(selectSubjectAcademicConfigError);

  const loadSubjectAcademicConfigs = useCallback(
    async (params?: SubjectAcademicConfigListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await subjectAcademicConfigService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar configuraciones",
          ),
        );
      }
    },
    [dispatch],
  );

  const createSubjectAcademicConfig = useCallback(
    async (data: SubjectAcademicConfigCreateParamsT): Promise<SubjectAcademicConfigT> => {
      try {
        const created = await subjectAcademicConfigService.create(data);
        dispatch(configCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateSubjectAcademicConfig = useCallback(
    async (params: SubjectAcademicConfigUpdateParamsT): Promise<SubjectAcademicConfigT> => {
      try {
        const updated = await subjectAcademicConfigService.update(params);
        dispatch(configUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteSubjectAcademicConfig = useCallback(
    async (id: SubjectAcademicConfigDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await subjectAcademicConfigService.softDelete(id);
        dispatch(configDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al eliminar configuracion",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    subjectAcademicConfigs,
    isLoading: status === "loading",
    error,
    loadSubjectAcademicConfigs,
    createSubjectAcademicConfig,
    updateSubjectAcademicConfig,
    deleteSubjectAcademicConfig,
  };
};

export type SubjectAcademicConfigControllerT = ReturnType<
  typeof useSubjectAcademicConfigController
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
    const obj = error as CreateSubjectAcademicConfigRejectValue;
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
  data: SubjectAcademicConfigCreateDataT,
  create: SubjectAcademicConfigControllerT["createSubjectAcademicConfig"],
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
      errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState,
    };
  }
};

const unwrapUpdate = async (
  params: SubjectAcademicConfigUpdateParamsT,
  update: SubjectAcademicConfigControllerT["updateSubjectAcademicConfig"],
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
      errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState,
    };
  }
};

interface UseSubjectAcademicConfigFormArgs {
  create: SubjectAcademicConfigControllerT["createSubjectAcademicConfig"];
  update: SubjectAcademicConfigControllerT["updateSubjectAcademicConfig"];
}

export const useSubjectAcademicConfigForm = ({
  create,
  update,
}: UseSubjectAcademicConfigFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubjectAcademicConfig, setEditingSubjectAcademicConfig] =
    useState<SubjectAcademicConfigT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingSubjectAcademicConfig;

  const openModal = useCallback((config?: SubjectAcademicConfigT) => {
    setEditingSubjectAcademicConfig(config ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSubjectAcademicConfig(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectAcademicConfigFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editingSubjectAcademicConfig) {
        const result = await unwrapUpdate(
          { id: editingSubjectAcademicConfig.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { subject, academic_grade, weekly_hours, is_required } = values;
        const result = await unwrapCreate(
          { subject, academic_grade, weekly_hours, is_required },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingSubjectAcademicConfig, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingSubjectAcademicConfig,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
