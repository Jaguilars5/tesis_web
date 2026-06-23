import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { subjectService } from "./subject.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectSubjectError,
  selectSubjects,
  selectSubjectsStatus,
  subjectCreated,
  subjectDeleted,
  subjectUpdated,
} from "./subject.slice";
import type {
  SubjectCreateDataT,
  SubjectCreateParamsT,
  SubjectDeleteParamsT,
  SubjectFormValues,
  SubjectListParamsT,
  SubjectT,
  SubjectUpdateParamsT,
} from "./subject.types";

export type CreateSubjectRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateSubjectRejectValue => {
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

export const useSubjectController = () => {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector(selectSubjects);
  const status = useAppSelector(selectSubjectsStatus);
  const error = useAppSelector(selectSubjectError);

  const loadSubjects = useCallback(
    async (params?: SubjectListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await subjectService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar materias",
          ),
        );
      }
    },
    [dispatch],
  );

  const createSubject = useCallback(
    async (data: SubjectCreateParamsT): Promise<SubjectT> => {
      try {
        const created = await subjectService.create(data);
        dispatch(subjectCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateSubject = useCallback(
    async (params: SubjectUpdateParamsT): Promise<SubjectT> => {
      try {
        const updated = await subjectService.update(params);
        dispatch(subjectUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteSubject = useCallback(
    async (id: SubjectDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await subjectService.softDelete(id);
        dispatch(subjectDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error
              ? err.message
              : "Error al eliminar materia",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    subjects,
    isLoading: status === "loading",
    error,
    loadSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export type SubjectControllerT = ReturnType<typeof useSubjectController>;

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
    const obj = error as CreateSubjectRejectValue;
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
  data: SubjectCreateDataT,
  create: SubjectControllerT["createSubject"],
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
  params: SubjectUpdateParamsT,
  update: SubjectControllerT["updateSubject"],
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

interface UseSubjectFormArgs {
  create: SubjectControllerT["createSubject"];
  update: SubjectControllerT["updateSubject"];
}

export const useSubjectForm = ({
  create,
  update,
}: UseSubjectFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingSubject;

  const openModal = useCallback((subject?: SubjectT) => {
    setEditingSubject(subject ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSubject(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editingSubject) {
        const result = await unwrapUpdate(
          { id: editingSubject.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { name, code } = values;
        const result = await unwrapCreate({ name, code }, create);
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingSubject, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingSubject,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
