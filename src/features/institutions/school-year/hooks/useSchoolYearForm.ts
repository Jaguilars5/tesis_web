import { unwrapMutation } from "@shared/utils/validationErrors";
import { useState, useCallback } from "react";

import type { SchoolYearT, SchoolYearFormValuesT } from "../school-year.types";
import type { useSchoolYearController } from "./useSchoolYearController";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

export type SYControllerT = ReturnType<typeof useSchoolYearController>;
export interface UseFormArgs {
  create: SYControllerT["createSchoolYear"];
  update: SYControllerT["updateSchoolYear"];
}

export const useSchoolYearForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolYearT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((schoolYear?: SchoolYearT) => {
    setEditing(schoolYear ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: SchoolYearFormValuesT) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { start_date, end_date } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { start_date, end_date } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { start_date, end_date } = values;
        const response = await unwrapMutation(
          { start_date, end_date, is_active: true },
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
    editingSchoolYear: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
