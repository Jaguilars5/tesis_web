import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { AcademicPeriodControllerT } from "./useAcademicPeriodController";
import type {
  AcademicPeriodCreateParamsT,
  AcademicPeriodFormValues,
  AcademicPeriodT,
  BulkCreateResponseT,
} from "../academic-period.types";

interface UseAcademicPeriodFormArgs {
  update: AcademicPeriodControllerT["updateAcademicPeriod"];
  bulkCreate: AcademicPeriodControllerT["bulkCreateAcademicPeriods"];
}

export const useAcademicPeriodForm = ({
  update,
  bulkCreate,
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

      let result: BulkCreateResponseT;
      try {
        result = await bulkCreate(items);
      } catch (err) {
        const msg =
          err && typeof err === "object" && "msg" in err
            ? (err as { msg: string }).msg
            : "Error al crear los periodos";
        setSubmitErrors({ general: [msg], validation: {} });
        return;
      }

      if (result.errors.length === 0) {
        closeModal();
        return;
      }

      const general: string[] = [];
      for (const errorItem of result.errors) {
        for (const [, msg] of Object.entries(errorItem.errors)) {
          general.push(`Periodo ${errorItem.index + 1}: ${msg}`);
        }
      }

      setSubmitErrors({ general, validation: {} });
    },
    [bulkCreate, closeModal],
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
