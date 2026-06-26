import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { BlockComponentT, BlockComponentFormValues } from "../block-components.types";
import type { useBlockComponentsController } from "./useBlockComponentsController";

export type BCControllerT = ReturnType<typeof useBlockComponentsController>;

export interface UseFormArgs {
  create: BCControllerT["createItem"];
  update: BCControllerT["updateItem"];
}

export const useBlockComponentsForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BlockComponentT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: BlockComponentT) => {
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
    async (values: BlockComponentFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { code, name, internal_weight, evaluation_block } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, internal_weight, evaluation_block } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, internal_weight, evaluation_block } = values;
        const response = await unwrapMutation(
          { code, name, internal_weight, evaluation_block },
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
    editingItem: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
