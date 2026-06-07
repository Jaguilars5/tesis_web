import { useCallback, useState } from "react";
import { createEvaluationType, updateEvaluationType } from "../../reducers/evaluation-types.thunks";
import { useEvaluationTypesController } from "./useEvaluationTypesController";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";

export interface EvaluationTypeFormValues {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
}

export const useEvaluationTypesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvaluationType, setEditingEvaluationType] = useState<EvaluationTypeT | null>(null);
  const isEdit = !!editingEvaluationType;

  const { createEvaluationType: create, updateEvaluationType: update } = useEvaluationTypesController();

  const openModal = useCallback((evaluationType?: EvaluationTypeT) => {
    setEditingEvaluationType(evaluationType ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingEvaluationType(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: EvaluationTypeFormValues) => {
      let result;
      if (editingEvaluationType) {
        result = await update({
          code: values.code,
          name: values.name,
          description: values.description,
          is_active: values.is_active,
          order: values.order,
          id: editingEvaluationType.id,
        });
      } else {
        result = await create({
          code: values.code,
          name: values.name,
          description: values.description,
          order: values.order,
        });
      }
      if (
        createEvaluationType.fulfilled.match(result) ||
        updateEvaluationType.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingEvaluationType, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingEvaluationType,
    openModal,
    closeModal,
    handleSubmit,
  };
};
