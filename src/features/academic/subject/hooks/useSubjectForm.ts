import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { SubjectControllerT } from "./useSubjectController";
import type { SubjectFormValues, SubjectT } from "../subject.types";

interface UseSubjectFormArgs {
  create: SubjectControllerT["createSubject"];
  update: SubjectControllerT["updateSubject"];
}

export const useSubjectForm = ({ create, update }: UseSubjectFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((subject?: SubjectT) => {
    setEditing(subject ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { name, code, is_active } = values;
      if (editing) {
        const response = await unwrapMutation(
          { id: editing.id, data: { name, code, is_active } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const response = await unwrapMutation({ name, code, is_active: true }, create);
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
    editingSubject: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
