import { useCallback, useState } from "react";
import {
  createSubject,
  updateSubject,
} from "../../application/use-cases";
import { useSubjectController } from "./useSubjectController";
import type { SubjectFormValues } from "../utils/subject.validation";
import type { SubjectT } from "../../domain/entities/subject.types";

export const useSubjectForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectT | null>(null);
  const isEdit = !!editingSubject;

  const {
    createSubject: create,
    updateSubject: update,
  } = useSubjectController();

  const openModal = useCallback((subject?: SubjectT) => {
    setEditingSubject(subject ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingSubject(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectFormValues) => {
      let result;
      if (editingSubject) {
        result = await update(editingSubject.id, {
          name: values.name,
          code: values.code,
          is_active: values.is_active,
        });
      } else {
        result = await create({
          name: values.name,
          code: values.code,
        });
      }
      if (
        createSubject.fulfilled.match(result) ||
        updateSubject.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingSubject, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingSubject,
    openModal,
    closeModal,
    handleSubmit,
  };
};
