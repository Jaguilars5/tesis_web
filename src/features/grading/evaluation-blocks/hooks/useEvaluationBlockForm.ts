import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { EvaluationBlockT, EvaluationBlockFormValues } from "../evaluation-blocks.types";
import type { EvaluationBlockControllerT } from "./useEvaluationBlockController";

export interface UseFormArgs {
  create: EvaluationBlockControllerT["createItem"];
  update: EvaluationBlockControllerT["updateItem"];
}

export const useEvaluationBlockForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EvaluationBlockT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: EvaluationBlockT) => {
    setEditing(item ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: EvaluationBlockFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const response = await unwrapMutation(
          { id: editing.id, data: values },
          update,
        );
        if (response.ok) { closeModal(); return; }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, weight_percentage, academic_period, subject_offering, block_type } = values;
        const response = await unwrapMutation(
          { code, name, weight_percentage, academic_period, subject_offering, block_type },
          create,
        );
        if (response.ok) { closeModal(); return; }
        setSubmitErrors(response.errors);
      }
    },
    [editing, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingItem: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
