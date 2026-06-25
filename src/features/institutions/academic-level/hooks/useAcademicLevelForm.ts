import { useState, useCallback } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";

import type {
  AcademicLevelT,
  AcademicLevelFormValues,
} from "../academic-level.types";
import type { useAcademicLevelController } from "./useAcademicLevelController";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

export type ALControllerT = ReturnType<typeof useAcademicLevelController>;

export interface UseFormArgs {
  create: ALControllerT["createAcademicLevel"];
  update: ALControllerT["updateAcademicLevel"];
}

export const useAcademicLevelForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicLevelT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((s?: AcademicLevelT) => {
    setEditing(s ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: AcademicLevelFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { code, name, description } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, description } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, description } = values;
        const response = await unwrapMutation(
          { code, name, description },
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
    editingAcademicLevel: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
