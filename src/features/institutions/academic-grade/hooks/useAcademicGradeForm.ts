import { useState, useCallback } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  AcademicGradeT,
  AcademicGradeFormValues,
} from "../academic-grade.types";
import type { useAcademicGradeController } from "./useAcademicGradeController";

export type AGControllerT = ReturnType<typeof useAcademicGradeController>;

export interface UseFormArgs {
  create: AGControllerT["createAcademicGrade"];
  update: AGControllerT["updateAcademicGrade"];
}

export const useAcademicGradeForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicGradeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((grade?: AcademicGradeT) => {
    setEditing(grade ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: AcademicGradeFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { code, name, academic_sublevel } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, academic_sublevel } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, academic_sublevel } = values;
        const response = await unwrapMutation(
          { code, name, academic_sublevel },
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
    editingAcademicGrade: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
