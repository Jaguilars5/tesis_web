import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { BehaviorEvaluationT, BehaviorEvaluationFormValues } from "../behavior-evaluation.types";
import type { useBehaviorEvaluationController } from "./useBehaviorEvaluationController";

export type BEControllerT = ReturnType<typeof useBehaviorEvaluationController>;

export interface UseFormArgs {
  update: BEControllerT["updateItem"];
}

export const useBehaviorEvaluationForm = ({ update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BehaviorEvaluationT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const openModal = useCallback((evaluation?: BehaviorEvaluationT) => {
    setEditing(evaluation ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: BehaviorEvaluationFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (!editing) return;
      const { final_scale, override_reason, general_observation } = values;
      const response = await unwrapMutation(
        { id: editing.id, data: { final_scale, override_reason, general_observation } },
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
    editingItem: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
