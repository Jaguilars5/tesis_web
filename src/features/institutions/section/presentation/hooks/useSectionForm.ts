import { useCallback, useState } from "react";
import { createSection, updateSection } from "../../reducers/section.reducer";
import { useSectionController } from "./useSectionController";
import type { SectionT } from "../../domain/entities/section.types";

export interface SectionFormValues {
  parallel: string;
  capacity: number;
  school_year: number;
  academic_grade: number | null;
  is_active: boolean;
}

export const useSectionForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionT | null>(null);
  const isEdit = !!editingSection;
  const { createSection: create, updateSection: update } = useSectionController();

  const openModal = useCallback((section?: SectionT) => {
    setEditingSection(section ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSection(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: SectionFormValues) => {
      let result;
      if (editingSection) {
        result = await update(editingSection.id, values);
      } else {
        result = await create(values);
      }
      if (
        createSection.fulfilled.match(result) ||
        updateSection.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingSection, create, update, closeModal],
  );

  return { isOpen, isEdit, editingSection, openModal, closeModal, handleSubmit };
};
