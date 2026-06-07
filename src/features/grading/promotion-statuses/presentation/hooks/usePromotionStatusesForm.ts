import { useCallback, useState } from "react";
import { createPromotionStatus, updatePromotionStatus } from "../../reducers/promotion-statuses.thunks";
import { usePromotionStatusesController } from "./usePromotionStatusesController";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";

export interface PromotionStatusFormValues {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
}

export const usePromotionStatusesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPromotionStatus, setEditingPromotionStatus] = useState<PromotionStatusT | null>(null);
  const isEdit = !!editingPromotionStatus;

  const { createPromotionStatus: create, updatePromotionStatus: update } = usePromotionStatusesController();

  const openModal = useCallback((promotionStatus?: PromotionStatusT) => {
    setEditingPromotionStatus(promotionStatus ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingPromotionStatus(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: PromotionStatusFormValues) => {
      let result;
      if (editingPromotionStatus) {
        result = await update({
          code: values.code,
          name: values.name,
          description: values.description,
          is_active: values.is_active,
          order: values.order,
          id: editingPromotionStatus.id,
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
        createPromotionStatus.fulfilled.match(result) ||
        updatePromotionStatus.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingPromotionStatus, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingPromotionStatus,
    openModal,
    closeModal,
    handleSubmit,
  };
};
