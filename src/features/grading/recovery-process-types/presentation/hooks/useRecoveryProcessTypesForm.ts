import { useCallback, useState } from "react";
import { createRecoveryProcessType, updateRecoveryProcessType } from "../../reducers/recovery-process-types.thunks";
import { useRecoveryProcessTypesController } from "./useRecoveryProcessTypesController";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";

export interface RecoveryProcessTypeFormValues {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
}

export const useRecoveryProcessTypesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRecoveryProcessType, setEditingRecoveryProcessType] = useState<RecoveryProcessTypeT | null>(null);
  const isEdit = !!editingRecoveryProcessType;

  const { createRecoveryProcessType: create, updateRecoveryProcessType: update } = useRecoveryProcessTypesController();

  const openModal = useCallback((recoveryProcessType?: RecoveryProcessTypeT) => {
    setEditingRecoveryProcessType(recoveryProcessType ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingRecoveryProcessType(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: RecoveryProcessTypeFormValues) => {
      let result;
      if (editingRecoveryProcessType) {
        result = await update({
          code: values.code,
          name: values.name,
          description: values.description,
          is_active: values.is_active,
          order: values.order,
          id: editingRecoveryProcessType.id,
        });
      } else {
        result = await create({
          code: values.code,
          name: values.name,
          description: values.description,
          order: values.order,
        });
      }
      if (
        createRecoveryProcessType.fulfilled.match(result) ||
        updateRecoveryProcessType.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingRecoveryProcessType, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingRecoveryProcessType,
    openModal,
    closeModal,
    handleSubmit,
  };
};
