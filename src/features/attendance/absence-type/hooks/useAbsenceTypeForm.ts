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
      if (editing) {
        const { code, name, description } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, description } },
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
          { code, name, description },
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
