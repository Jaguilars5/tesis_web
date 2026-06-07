import { useCallback, useState } from "react";
import { createBlockComponent, updateBlockComponent } from "../../reducers/block-components.thunks";
import { useBlockComponentsController } from "./useBlockComponentsController";
import type { BlockComponentT } from "../../domain/entities/block-components.types";

export interface BlockComponentFormValues {
  name: string;
  internal_weight: number;
  evaluation_block: number;
}

export const useBlockComponentsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBlockComponent, setEditingBlockComponent] = useState<BlockComponentT | null>(null);
  const isEdit = !!editingBlockComponent;

  const { createBlockComponent: create, updateBlockComponent: update } = useBlockComponentsController();

  const openModal = useCallback((blockComponent?: BlockComponentT) => {
    setEditingBlockComponent(blockComponent ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingBlockComponent(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: BlockComponentFormValues) => {
      let result;
      if (editingBlockComponent) {
        result = await update({
          name: values.name,
          internal_weight: values.internal_weight,
          evaluation_block: values.evaluation_block,
          id: editingBlockComponent.id,
        });
      } else {
        result = await create({
          name: values.name,
          internal_weight: values.internal_weight,
          evaluation_block: values.evaluation_block,
        });
      }
      if (
        createBlockComponent.fulfilled.match(result) ||
        updateBlockComponent.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingBlockComponent, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingBlockComponent,
    openModal,
    closeModal,
    handleSubmit,
  };
};
