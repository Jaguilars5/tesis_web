import { useCallback, useState } from "react";
import { createAcademicSubnivel, updateAcademicSubnivel } from "../../reducers/academic-subnivel.reducer";
import { useAcademicSubnivelController } from "./useAcademicSubnivelController";
import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";

export interface AcademicSubnivelFormValues {
  code: string;
  name: string;
  description?: string;
  order: number;
  academic_level: number;
  is_active: boolean;
}

export const useAcademicSubnivelForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAcademicSubnivel, setEditingAcademicSubnivel] = useState<AcademicSubnivelT | null>(null);
  const isEdit = !!editingAcademicSubnivel;
  const { createAcademicSubnivel: create, updateAcademicSubnivel: update } = useAcademicSubnivelController();

  const openModal = useCallback((academicSubnivel?: AcademicSubnivelT) => {
    setEditingAcademicSubnivel(academicSubnivel ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAcademicSubnivel(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: AcademicSubnivelFormValues) => {
      let result;
      if (editingAcademicSubnivel) {
        result = await update(editingAcademicSubnivel.id, values);
      } else {
        result = await create(values);
      }
      if (
        createAcademicSubnivel.fulfilled.match(result) ||
        updateAcademicSubnivel.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingAcademicSubnivel, create, update, closeModal],
  );

  return { isOpen, isEdit, editingAcademicSubnivel, openModal, closeModal, handleSubmit };
};
