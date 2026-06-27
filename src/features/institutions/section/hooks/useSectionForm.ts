import { useState, useCallback } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { SectionT, SectionFormValues } from "../section.types";
import type { useSectionController } from "./useSectionController";

export type SectionControllerT = ReturnType<typeof useSectionController>;

export interface UseFormArgs {
  create: SectionControllerT["createSection"];
  update: SectionControllerT["updateSection"];
}

export const useSectionForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SectionT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((section?: SectionT) => {
    setEditing(section ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SectionFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { parallel, school_year, academic_grade, capacity, code } =
          values;
        const response = await unwrapMutation(
          {
            id: editing.id,
            data: { parallel, school_year, academic_grade, capacity, code },
          },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { parallel, school_year, academic_grade, capacity, code } =
          values;
        const response = await unwrapMutation(
          { parallel, school_year, academic_grade, capacity, code },
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
    editingSection: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
