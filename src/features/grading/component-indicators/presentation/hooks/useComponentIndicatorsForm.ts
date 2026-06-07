import { useCallback, useState } from "react";
import { createComponentIndicator, updateComponentIndicator } from "../../reducers/component-indicators.thunks";
import { useComponentIndicatorsController } from "./useComponentIndicatorsController";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

export interface ComponentIndicatorFormValues {
  name: string;
  internal_weight: number;
  block_component: number;
}

export const useComponentIndicatorsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingComponentIndicator, setEditingComponentIndicator] = useState<ComponentIndicatorT | null>(null);
  const isEdit = !!editingComponentIndicator;

  const { createComponentIndicator: create, updateComponentIndicator: update } = useComponentIndicatorsController();

  const openModal = useCallback((componentIndicator?: ComponentIndicatorT) => {
    setEditingComponentIndicator(componentIndicator ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingComponentIndicator(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: ComponentIndicatorFormValues) => {
      let result;
      if (editingComponentIndicator) {
        result = await update({
          name: values.name,
          internal_weight: values.internal_weight,
          block_component: values.block_component,
          id: editingComponentIndicator.id,
        });
      } else {
        result = await create({
          name: values.name,
          internal_weight: values.internal_weight,
          block_component: values.block_component,
        });
      }
      if (
        createComponentIndicator.fulfilled.match(result) ||
        updateComponentIndicator.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingComponentIndicator, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingComponentIndicator,
    openModal,
    closeModal,
    handleSubmit,
  };
};
