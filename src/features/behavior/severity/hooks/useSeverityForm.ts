import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { SeverityT, SeverityFormValues } from "../severity.types";
import type { useSeverityController } from "./useSeverityController";

export type SControllerT = ReturnType<typeof useSeverityController>;

export interface UseFormArgs {
  create: SControllerT["createItem"];
  update: SControllerT["updateItem"];
}

export const useSeverityForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SeverityT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: SeverityT) => {
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
    async (values: SeverityFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { code, name, description, is_active } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, description, is_active } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, description } = values;
        const response = await unwrapMutation(
          { code, name, description, is_active: true },
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
