import { useCallback, useState } from "react";
import { createAcademicLevel, updateAcademicLevel } from "../../application";
import { useAcademicLevelController } from "./useAcademicLevelController";
import type { AcademicLevelT } from "../../domain/entities/academic-level.types";
import type { AcademicLevelFormValues } from "../../components/form/AcademicLevelFormModal";

export const useAcademicLevelForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAcademicLevel, setEditingAcademicLevel] =
    useState<AcademicLevelT | null>(null);
  const isEdit = !!editingAcademicLevel;

  const { createAcademicLevel: create, updateAcademicLevel: update } =
    useAcademicLevelController();

  const openModal = useCallback((academicLevel?: AcademicLevelT) => {
    setEditingAcademicLevel(academicLevel ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAcademicLevel(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: AcademicLevelFormValues) => {
      let result;
      if (editingAcademicLevel) {
        result = await update({
          name: values.name,
          is_active: values.is_active,
          id: editingAcademicLevel.id,
        });
      } else {
        result = await create({
          name: values.name,
        });
      }
      if (
        createAcademicLevel.fulfilled.match(result) ||
        updateAcademicLevel.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingAcademicLevel, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingAcademicLevel,
    openModal,
    closeModal,
    handleSubmit,
  };
};
