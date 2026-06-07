import { useCallback, useState } from "react";
import { createGradeType, updateGradeType } from "../../reducers/grade-types.thunks";
import { useGradeTypesController } from "./useGradeTypesController";
import type { GradeTypeT } from "../../domain/entities/grade-types.types";

export interface GradeTypeFormValues {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  order: number;
  applicable_subniveles: number[];
}

export const useGradeTypesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingGradeType, setEditingGradeType] = useState<GradeTypeT | null>(null);
  const isEdit = !!editingGradeType;

  const { createGradeType: create, updateGradeType: update } = useGradeTypesController();

  const openModal = useCallback((gradeType?: GradeTypeT) => {
    setEditingGradeType(gradeType ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingGradeType(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: GradeTypeFormValues) => {
      let result;
      if (editingGradeType) {
        result = await update({
          code: values.code,
          name: values.name,
          description: values.description,
          is_active: values.is_active,
          order: values.order,
          applicable_subniveles: values.applicable_subniveles,
          id: editingGradeType.id,
        });
      } else {
        result = await create({
          code: values.code,
          name: values.name,
          description: values.description,
          order: values.order,
          applicable_subniveles: values.applicable_subniveles,
        });
      }
      if (
        createGradeType.fulfilled.match(result) ||
        updateGradeType.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingGradeType, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingGradeType,
    openModal,
    closeModal,
    handleSubmit,
  };
};
