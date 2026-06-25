import { useState, useCallback } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  AcademicSubLevelT,
  AcademicSubLevelFormValues,
} from "../academic-sublevel.types";
import type { useAcademicSubLevelController } from "./useAcademicSubLevelController";

export type ASLControllerT = ReturnType<typeof useAcademicSubLevelController>;

export interface UseFormArgs {
  create: ASLControllerT["createAcademicSubLevel"];
  update: ASLControllerT["updateAcademicSubLevel"];
}

export const useAcademicSubLevelForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicSubLevelT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((s?: AcademicSubLevelT) => {
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
    async (values: AcademicSubLevelFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { code, name, description, academic_level } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, description, academic_level } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, description, academic_level } = values;
        const response = await unwrapMutation(
          { code, name, description, academic_level },
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
    editingAcademicSubLevel: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
