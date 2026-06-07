import { useCallback, useState } from "react";
import { createSubjectOffering, updateSubjectOffering } from "../../reducers/subject-offering.reducer";
import { useSubjectOfferingController } from "./useSubjectOfferingController";
import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";

export interface SubjectOfferingFormValues {
  school_year: number;
  section: number;
  subject_academic_config: number;
  is_active: boolean;
}

export const useSubjectOfferingForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubjectOffering, setEditingSubjectOffering] = useState<SubjectOfferingT | null>(null);
  const isEdit = !!editingSubjectOffering;
  const { createSubjectOffering: create, updateSubjectOffering: update } = useSubjectOfferingController();

  const openModal = useCallback((subjectOffering?: SubjectOfferingT) => {
    setEditingSubjectOffering(subjectOffering ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSubjectOffering(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectOfferingFormValues) => {
      let result;
      if (editingSubjectOffering) {
        result = await update(editingSubjectOffering.id, values);
      } else {
        result = await create(values);
      }
      if (
        createSubjectOffering.fulfilled.match(result) ||
        updateSubjectOffering.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingSubjectOffering, create, update, closeModal],
  );

  return { isOpen, isEdit, editingSubjectOffering, openModal, closeModal, handleSubmit };
};
