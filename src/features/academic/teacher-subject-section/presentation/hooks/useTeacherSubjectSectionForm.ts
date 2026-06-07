import { useCallback, useState } from "react";
import type { TeacherSubjectSectionT } from "../../domain/teacher-subject-section.entity";

export interface TeacherSubjectSectionFormValues {
  user: number;
  subject_offering: number;
  is_active: boolean;
}

export const useTeacherSubjectSectionsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeacherSubjectSection, setEditingTeacherSubjectSection] = useState<TeacherSubjectSectionT | null>(null);
  const isEdit = !!editingTeacherSubjectSection;

  const openModal = useCallback((assignment?: TeacherSubjectSectionT) => {
    setEditingTeacherSubjectSection(assignment ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingTeacherSubjectSection(null);
  }, []);

  const handleSubmit = useCallback(
    async () => {
      closeModal();
    },
    [closeModal],
  );

  return { isOpen, isEdit, editingTeacherSubjectSection, openModal, closeModal, handleSubmit };
};
