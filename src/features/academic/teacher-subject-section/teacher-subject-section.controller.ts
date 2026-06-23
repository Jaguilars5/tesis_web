import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { teacherSubjectSectionService } from "./teacher-subject-section.service";
import {
  assignmentCreated,
  assignmentDeleted,
  assignmentUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectTeacherSubjectSectionError,
  selectTeacherSubjectSections,
  selectTeacherSubjectSectionsStatus,
} from "./teacher-subject-section.slice";
import type {
  TeacherSubjectSectionCreateDataT,
  TeacherSubjectSectionCreateParamsT,
  TeacherSubjectSectionDeleteParamsT,
  TeacherSubjectSectionFormValues,
  TeacherSubjectSectionListParamsT,
  TeacherSubjectSectionT,
  TeacherSubjectSectionUpdateParamsT,
} from "./teacher-subject-section.types";

export type CreateTeacherSubjectSectionRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateTeacherSubjectSectionRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return {
    msg,
    data: (responseData?.data as Record<string, string> | null) ?? null,
  };
};

export const useTeacherSubjectSectionController = () => {
  const dispatch = useAppDispatch();
  const teacherSubjectSections = useAppSelector(selectTeacherSubjectSections);
  const status = useAppSelector(selectTeacherSubjectSectionsStatus);
  const error = useAppSelector(selectTeacherSubjectSectionError);

  const loadTeacherSubjectSections = useCallback(
    async (params?: TeacherSubjectSectionListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await teacherSubjectSectionService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar asignaciones",
          ),
        );
      }
    },
    [dispatch],
  );

  const createTeacherSubjectSection = useCallback(
    async (data: TeacherSubjectSectionCreateParamsT): Promise<TeacherSubjectSectionT> => {
      try {
        const created = await teacherSubjectSectionService.create(data);
        dispatch(assignmentCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateTeacherSubjectSection = useCallback(
    async (params: TeacherSubjectSectionUpdateParamsT): Promise<TeacherSubjectSectionT> => {
      try {
        const updated = await teacherSubjectSectionService.update(params);
        dispatch(assignmentUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteTeacherSubjectSection = useCallback(
    async (id: TeacherSubjectSectionDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await teacherSubjectSectionService.softDelete(id);
        dispatch(assignmentDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al eliminar asignacion",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    teacherSubjectSections,
    isLoading: status === "loading",
    error,
    loadTeacherSubjectSections,
    createTeacherSubjectSection,
    updateTeacherSubjectSection,
    deleteTeacherSubjectSection,
  };
};

export type TeacherSubjectSectionControllerT = ReturnType<
  typeof useTeacherSubjectSectionController
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
    const obj = error as CreateTeacherSubjectSectionRejectValue;
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
  data: TeacherSubjectSectionCreateDataT,
  create: TeacherSubjectSectionControllerT["createTeacherSubjectSection"],
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
  params: TeacherSubjectSectionUpdateParamsT,
  update: TeacherSubjectSectionControllerT["updateTeacherSubjectSection"],
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

interface UseTeacherSubjectSectionFormArgs {
  create: TeacherSubjectSectionControllerT["createTeacherSubjectSection"];
  update: TeacherSubjectSectionControllerT["updateTeacherSubjectSection"];
}

export const useTeacherSubjectSectionForm = ({
  create,
  update,
}: UseTeacherSubjectSectionFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeacherSubjectSection, setEditingTeacherSubjectSection] =
    useState<TeacherSubjectSectionT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingTeacherSubjectSection;

  const openModal = useCallback((assignment?: TeacherSubjectSectionT) => {
    setEditingTeacherSubjectSection(assignment ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingTeacherSubjectSection(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: TeacherSubjectSectionFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editingTeacherSubjectSection) {
        const result = await unwrapUpdate(
          { id: editingTeacherSubjectSection.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { user, subject_offering } = values;
        const result = await unwrapCreate(
          { user, subject_offering },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingTeacherSubjectSection, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingTeacherSubjectSection,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
