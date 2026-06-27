import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { SubjectAcademicConfigControllerT } from "./useSubjectAcademicConfigController";
import type {
  SubjectAcademicConfigFormValues,
  SubjectAcademicConfigT,
} from "../subject-academic-config.types";

interface UseSubjectAcademicConfigFormArgs {
  create: SubjectAcademicConfigControllerT["createSubjectAcademicConfig"];
  update: SubjectAcademicConfigControllerT["updateSubjectAcademicConfig"];
}

export const useSubjectAcademicConfigForm = ({
  create,
  update,
}: UseSubjectAcademicConfigFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectAcademicConfigT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((config?: SubjectAcademicConfigT) => {
    setEditing(config ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectAcademicConfigFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { subject, academic_grade, weekly_hours, is_required, is_active } = values;
      if (editing) {
        const response = await unwrapMutation(
          {
            id: editing.id,
            data: { subject, academic_grade, weekly_hours, is_required, is_active },
          },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const response = await unwrapMutation(
          { subject, academic_grade, weekly_hours, is_required, is_active: true },
          create,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      }
    },
    [editing, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingSubjectAcademicConfig: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
