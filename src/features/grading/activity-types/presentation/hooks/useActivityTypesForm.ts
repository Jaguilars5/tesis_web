import { useCallback, useState } from "react";
import { createActivityType, updateActivityType } from "../../reducers/activity-types.thunks";
import { useActivityTypesController } from "./useActivityTypesController";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";

export interface ActivityTypeFormValues {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
}

export const useActivityTypesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingActivityType, setEditingActivityType] = useState<ActivityTypeT | null>(null);
  const isEdit = !!editingActivityType;

  const { createActivityType: create, updateActivityType: update } = useActivityTypesController();

  const openModal = useCallback((activityType?: ActivityTypeT) => {
    setEditingActivityType(activityType ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingActivityType(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: ActivityTypeFormValues) => {
      let result;
      if (editingActivityType) {
        result = await update({
          code: values.code,
          name: values.name,
          description: values.description,
          is_active: values.is_active,
          order: values.order,
          id: editingActivityType.id,
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
        createActivityType.fulfilled.match(result) ||
        updateActivityType.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingActivityType, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingActivityType,
    openModal,
    closeModal,
    handleSubmit,
  };
};
