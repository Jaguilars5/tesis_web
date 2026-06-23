import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { subjectOfferingService } from "./subject-offering.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  offeringCreated,
  offeringDeleted,
  offeringUpdated,
  selectSubjectOfferingError,
  selectSubjectOfferings,
  selectSubjectOfferingsStatus,
} from "./subject-offering.slice";
import type {
  SubjectOfferingCreateDataT,
  SubjectOfferingCreateParamsT,
  SubjectOfferingDeleteParamsT,
  SubjectOfferingFormValues,
  SubjectOfferingListParamsT,
  SubjectOfferingT,
  SubjectOfferingUpdateParamsT,
} from "./subject-offering.types";

export type CreateSubjectOfferingRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateSubjectOfferingRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return {
    msg,
    data: (responseData?.data as Record<string, string> | null) ?? null,
  };
};

export const useSubjectOfferingController = () => {
  const dispatch = useAppDispatch();
  const subjectOfferings = useAppSelector(selectSubjectOfferings);
  const status = useAppSelector(selectSubjectOfferingsStatus);
  const error = useAppSelector(selectSubjectOfferingError);

  const loadSubjectOfferings = useCallback(
    async (params?: SubjectOfferingListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await subjectOfferingService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar ofertas de materia",
          ),
        );
      }
    },
    [dispatch],
  );

  const createSubjectOffering = useCallback(
    async (data: SubjectOfferingCreateParamsT): Promise<SubjectOfferingT> => {
      try {
        const created = await subjectOfferingService.create(data);
        dispatch(offeringCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateSubjectOffering = useCallback(
    async (params: SubjectOfferingUpdateParamsT): Promise<SubjectOfferingT> => {
      try {
        const updated = await subjectOfferingService.update(params);
        dispatch(offeringUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteSubjectOffering = useCallback(
    async (id: SubjectOfferingDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await subjectOfferingService.softDelete(id);
        dispatch(offeringDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al eliminar oferta de materia",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    subjectOfferings,
    isLoading: status === "loading",
    error,
    loadSubjectOfferings,
    createSubjectOffering,
    updateSubjectOffering,
    deleteSubjectOffering,
  };
};

export type SubjectOfferingControllerT = ReturnType<
  typeof useSubjectOfferingController
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
    const obj = error as CreateSubjectOfferingRejectValue;
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
  data: SubjectOfferingCreateDataT,
  create: SubjectOfferingControllerT["createSubjectOffering"],
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
  params: SubjectOfferingUpdateParamsT,
  update: SubjectOfferingControllerT["updateSubjectOffering"],
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

interface UseSubjectOfferingFormArgs {
  create: SubjectOfferingControllerT["createSubjectOffering"];
  update: SubjectOfferingControllerT["updateSubjectOffering"];
}

export const useSubjectOfferingForm = ({
  create,
  update,
}: UseSubjectOfferingFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubjectOffering, setEditingSubjectOffering] =
    useState<SubjectOfferingT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingSubjectOffering;

  const openModal = useCallback((offering?: SubjectOfferingT) => {
    setEditingSubjectOffering(offering ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSubjectOffering(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectOfferingFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editingSubjectOffering) {
        const { section, subject_academic_config, is_active } = values;
        const result = await unwrapUpdate(
          { id: editingSubjectOffering.id, data: { section, subject_academic_config, is_active } },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { section, subject_academic_config } = values;
        const result = await unwrapCreate(
          { section, subject_academic_config },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingSubjectOffering, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingSubjectOffering,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
