import { useCallback, useState } from "react";
import { createEvaluationBlock, updateEvaluationBlock } from "../../reducers/evaluation-blocks.reducer";
import { useEvaluationBlockController } from "./useEvaluationBlockController";
import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";

export interface EvaluationBlockFormValues {
  name: string;
  weight_percentage: number;
  academic_period: number;
  evaluation_type: number | null;
  is_active: boolean;
}

export const useEvaluationBlockForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvaluationBlock, setEditingEvaluationBlock] = useState<EvaluationBlockT | null>(null);
  const isEdit = !!editingEvaluationBlock;
  const { createEvaluationBlock: create, updateEvaluationBlock: update } = useEvaluationBlockController();

  const openModal = useCallback((evaluationBlock?: EvaluationBlockT) => {
    setEditingEvaluationBlock(evaluationBlock ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingEvaluationBlock(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: EvaluationBlockFormValues) => {
      let result;
      if (editingEvaluationBlock) {
        result = await update(editingEvaluationBlock.id, values);
      } else {
        result = await create(values);
      }
      if (
        createEvaluationBlock.fulfilled.match(result) ||
        updateEvaluationBlock.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingEvaluationBlock, create, update, closeModal],
  );

  return { isOpen, isEdit, editingEvaluationBlock, openModal, closeModal, handleSubmit };
};
