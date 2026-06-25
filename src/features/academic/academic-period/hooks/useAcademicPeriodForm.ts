import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { AcademicPeriodControllerT } from "./useAcademicPeriodController";
import type {
  AcademicPeriodCreateParamsT,
  AcademicPeriodFormValues,
  AcademicPeriodT,
} from "../academic-period.types";

interface UseAcademicPeriodFormArgs {
  create: AcademicPeriodControllerT["createAcademicPeriod"];
  update: AcademicPeriodControllerT["updateAcademicPeriod"];
}

export const useAcademicPeriodForm = ({
  create,
  update,
}: UseAcademicPeriodFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicPeriodT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((academicPeriod?: AcademicPeriodT) => {
    setEditing(academicPeriod ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleCreateMany = useCallback(
    async (items: AcademicPeriodCreateParamsT[]) => {
      setSubmitErrors({ general: [], validation: {} });
      if (items.length === 0) {
        closeModal();
        return;
      }

      const settled = await Promise.all(
        items.map((data) => unwrapMutation(data, create)),
      );

      if (settled.every((response) => response.ok)) {
        closeModal();
        return;
      }

      const general: string[] = [];
      const validation: Record<string, string> = {};
      for (const response of settled) {
        if (!response.ok) {
          general.push(...response.errors.general);
          Object.assign(validation, response.errors.validation);
        }
      }

      setSubmitErrors({ general, validation });
    },
    [create, closeModal],
  );

  const handleUpdate = useCallback(
    async (values: AcademicPeriodFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (!editing) {
        setSubmitErrors({
          general: ["No hay periodo en edición"],
          validation: {},
        });
        return;
      }
      const response = await unwrapMutation(
        { id: editing.id, data: values },
        update,
      );
      if (response.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(response.errors);
    },
    [editing, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingAcademicPeriod: editing,
    submitErrors,
    openModal,
    closeModal,
    handleCreateMany,
    handleUpdate,
  };
};
