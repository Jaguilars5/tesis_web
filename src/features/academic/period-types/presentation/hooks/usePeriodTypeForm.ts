import { useCallback, useState } from "react";
import { createPeriodType, updatePeriodType } from "../../reducers/period-types.thunks";
import { usePeriodTypeController } from "./usePeriodTypeController";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";

export interface PeriodTypeFormValues {
  name: string;
  is_active: boolean;
}

export const usePeriodTypeForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPeriodType, setEditingPeriodType] = useState<PeriodTypeT | null>(null);
  const isEdit = !!editingPeriodType;

  const { createPeriodType: create, updatePeriodType: update } = usePeriodTypeController();

  const openModal = useCallback((periodType?: PeriodTypeT) => {
    setEditingPeriodType(periodType ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingPeriodType(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: PeriodTypeFormValues) => {
      let result;
      if (editingPeriodType) {
        result = await update({
          name: values.name,
          is_active: values.is_active,
          id: editingPeriodType.id,
        });
      } else {
        result = await create({
          name: values.name,
        });
      }
      if (
        createPeriodType.fulfilled.match(result) ||
        updatePeriodType.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingPeriodType, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingPeriodType,
    openModal,
    closeModal,
    handleSubmit,
  };
};
