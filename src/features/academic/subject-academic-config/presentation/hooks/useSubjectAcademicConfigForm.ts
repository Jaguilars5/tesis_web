import { useCallback, useState } from "react";
import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";

export interface SubjectAcademicConfigFormValues {
  subject: number;
  academic_grade: number;
  weekly_hours: number;
  pedagogical_order: number;
  is_required: boolean;
  is_active: boolean;
}

export const useSubjectAcademicConfigsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubjectAcademicConfig, setEditingSubjectAcademicConfig] = useState<SubjectAcademicConfigT | null>(null);
  const isEdit = !!editingSubjectAcademicConfig;

  const openModal = useCallback((config?: SubjectAcademicConfigT) => {
    setEditingSubjectAcademicConfig(config ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSubjectAcademicConfig(null);
  }, []);

  const handleSubmit = useCallback(
    async () => {
      closeModal();
    },
    [closeModal],
  );

  return { isOpen, isEdit, editingSubjectAcademicConfig, openModal, closeModal, handleSubmit };
};
