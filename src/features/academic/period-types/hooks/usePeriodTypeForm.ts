import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { PeriodTypeControllerT } from "./usePeriodTypeController";
import type {
  PeriodTypeFormValues,
  PeriodTypeT,
} from "../period-types.types";

interface UsePeriodTypeFormArgs {
  create: PeriodTypeControllerT["createPeriodType"];
  update: PeriodTypeControllerT["updatePeriodType"];
}

export const usePeriodTypeForm = ({
  create,
  update,
}: UsePeriodTypeFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PeriodTypeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((periodType?: PeriodTypeT) => {
    setEditing(periodType ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: PeriodTypeFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { code, name, description, divisions_per_year, is_active } = values;
      if (editing) {
        const response = await unwrapMutation(
          {
            id: editing.id,
            data: { code, name, description, divisions_per_year, is_active },
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
          { code, name, description, divisions_per_year, is_active: true },
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
    editingPeriodType: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
