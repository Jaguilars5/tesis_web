import { useCallback, useState } from "react";
import { createAcademicGrade, updateAcademicGrade } from "../../reducers/academic-grade.reducer";
import { useAcademicGradeController } from "./useAcademicGradeController";
import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";

export interface AcademicGradeFormValues {
  name: string;
  academic_subnivel: number | null;
  sequence_order: number;
  is_active: boolean;
}

export const useAcademicGradeForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAcademicGrade, setEditingAcademicGrade] = useState<AcademicGradeT | null>(null);
  const isEdit = !!editingAcademicGrade;
  const { createAcademicGrade: create, updateAcademicGrade: update } = useAcademicGradeController();

  const openModal = useCallback((academicGrade?: AcademicGradeT) => {
    setEditingAcademicGrade(academicGrade ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAcademicGrade(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: AcademicGradeFormValues) => {
      let result;
      if (editingAcademicGrade) {
        result = await update(editingAcademicGrade.id, values);
      } else {
        result = await create(values);
      }
      if (
        createAcademicGrade.fulfilled.match(result) ||
        updateAcademicGrade.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingAcademicGrade, create, update, closeModal],
  );

  return { isOpen, isEdit, editingAcademicGrade, openModal, closeModal, handleSubmit };
};
