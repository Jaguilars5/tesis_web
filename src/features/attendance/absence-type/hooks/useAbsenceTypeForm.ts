import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { AbsenceTypeT, AbsenceTypeFormValues } from "../absence-type.types";
import type { useAbsenceTypeController } from "./useAbsenceTypeController";

export type ATControllerT = ReturnType<typeof useAbsenceTypeController>;

export interface UseFormArgs {
  create: ATControllerT["createItem"];
  update: ATControllerT["updateItem"];
}

export const useAbsenceTypeForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AbsenceTypeT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: AbsenceTypeT) => {
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
    async (values: AbsenceTypeFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { code, name, description, is_active } = values;
      if (editing) {
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
