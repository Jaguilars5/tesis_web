import { useCallback, useState } from "react";
import { createSchoolYear, updateSchoolYear } from "../../reducers/school-year.reducer";
import { useSchoolYearController } from "./useSchoolYearController";
import type { SchoolYearT } from "../../domain/entities/school-year.types";

export interface SchoolYearFormValues {
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const useSchoolYearForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSchoolYear, setEditingSchoolYear] = useState<SchoolYearT | null>(null);
  const isEdit = !!editingSchoolYear;
  const { createSchoolYear: create, updateSchoolYear: update } = useSchoolYearController();

  const openModal = useCallback((schoolYear?: SchoolYearT) => {
    setEditingSchoolYear(schoolYear ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSchoolYear(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: SchoolYearFormValues) => {
      let result;
      if (editingSchoolYear) {
        result = await update(editingSchoolYear.id, values);
      } else {
        result = await create(values);
      }
      if (
        createSchoolYear.fulfilled.match(result) ||
        updateSchoolYear.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingSchoolYear, create, update, closeModal],
  );

  return { isOpen, isEdit, editingSchoolYear, openModal, closeModal, handleSubmit };
};
