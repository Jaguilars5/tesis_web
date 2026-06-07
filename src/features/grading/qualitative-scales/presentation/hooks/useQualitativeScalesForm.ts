import { useCallback, useState } from "react";
import { createQualitativeScale, updateQualitativeScale } from "../../reducers/qualitative-scales.thunks";
import { useQualitativeScalesController } from "./useQualitativeScalesController";
import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";

export interface QualitativeScaleFormValues {
  code: string;
  description: string;
  numeric_equivalence: number;
}

export const useQualitativeScalesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingQualitativeScale, setEditingQualitativeScale] = useState<QualitativeScaleT | null>(null);
  const isEdit = !!editingQualitativeScale;

  const { createQualitativeScale: create, updateQualitativeScale: update } = useQualitativeScalesController();

  const openModal = useCallback((qualitativeScale?: QualitativeScaleT) => {
    setEditingQualitativeScale(qualitativeScale ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingQualitativeScale(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: QualitativeScaleFormValues) => {
      let result;
      if (editingQualitativeScale) {
        result = await update({
          code: values.code,
          description: values.description,
          numeric_equivalence: values.numeric_equivalence,
          id: editingQualitativeScale.id,
        });
      } else {
        result = await create({
          code: values.code,
          description: values.description,
          numeric_equivalence: values.numeric_equivalence,
        });
      }
      if (
        createQualitativeScale.fulfilled.match(result) ||
        updateQualitativeScale.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingQualitativeScale, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingQualitativeScale,
    openModal,
    closeModal,
    handleSubmit,
  };
};
