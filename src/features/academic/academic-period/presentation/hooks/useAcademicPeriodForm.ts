import { useCallback, useState } from "react";
import { createAcademicPeriod, updateAcademicPeriod } from "../../reducers/academic-period.reducer";
import { useAcademicPeriodController } from "./useAcademicPeriodController";
import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";

export interface AcademicPeriodFormValues {
  name: string;
  period_type: "REGULAR" | "SUPLETORIO" | "REFUERZO";
  start_date: string;
  end_date: string;
  is_regular_period: boolean;
  school_year: number;
  is_active: boolean;
}

export const useAcademicPeriodForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAcademicPeriod, setEditingAcademicPeriod] = useState<AcademicPeriodT | null>(null);
  const isEdit = !!editingAcademicPeriod;
  const { createAcademicPeriod: create, updateAcademicPeriod: update } = useAcademicPeriodController();

  const openModal = useCallback((academicPeriod?: AcademicPeriodT) => {
    setEditingAcademicPeriod(academicPeriod ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingAcademicPeriod(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: AcademicPeriodFormValues) => {
      let result;
      if (editingAcademicPeriod) {
        result = await update(editingAcademicPeriod.id, values);
      } else {
        result = await create(values);
      }
      if (
        createAcademicPeriod.fulfilled.match(result) ||
        updateAcademicPeriod.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingAcademicPeriod, create, update, closeModal],
  );

  return { isOpen, isEdit, editingAcademicPeriod, openModal, closeModal, handleSubmit };
};
