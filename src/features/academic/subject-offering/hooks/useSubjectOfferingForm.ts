import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { SubjectOfferingControllerT } from "./useSubjectOfferingController";
import type {
  SubjectOfferingFormValues,
  SubjectOfferingT,
} from "../subject-offering.types";

interface UseSubjectOfferingFormArgs {
  create: SubjectOfferingControllerT["createSubjectOffering"];
  update: SubjectOfferingControllerT["updateSubjectOffering"];
}

export const useSubjectOfferingForm = ({
  create,
  update,
}: UseSubjectOfferingFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectOfferingT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((offering?: SubjectOfferingT) => {
    setEditing(offering ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectOfferingFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { school_year, section, subject_academic_config, is_active } = values;
      if (editing) {
        const response = await unwrapMutation(
          {
            id: editing.id,
            data: { school_year, section, subject_academic_config, is_active },
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
          { school_year, section, subject_academic_config, is_active: true },
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
    editingSubjectOffering: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
