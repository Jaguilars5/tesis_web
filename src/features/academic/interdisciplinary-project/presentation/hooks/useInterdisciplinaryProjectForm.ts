import { useCallback, useState } from "react";
import { createInterdisciplinaryProject, updateInterdisciplinaryProject } from "../../reducers/interdisciplinary-project.reducer";
import { useInterdisciplinaryProjectController } from "./useInterdisciplinaryProjectController";
import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";

export interface InterdisciplinaryProjectFormValues {
  title: string;
  description: string | null;
  start_date: string;
  delivery_date: string;
  is_active: boolean;
  academic_period: number;
}

export const useInterdisciplinaryProjectForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingInterdisciplinaryProject, setEditingInterdisciplinaryProject] = useState<InterdisciplinaryProjectT | null>(null);
  const isEdit = !!editingInterdisciplinaryProject;
  const { createInterdisciplinaryProject: create, updateInterdisciplinaryProject: update } = useInterdisciplinaryProjectController();

  const openModal = useCallback((interdisciplinaryProject?: InterdisciplinaryProjectT) => {
    setEditingInterdisciplinaryProject(interdisciplinaryProject ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingInterdisciplinaryProject(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: InterdisciplinaryProjectFormValues) => {
      let result;
      if (editingInterdisciplinaryProject) {
        result = await update(editingInterdisciplinaryProject.id, values);
      } else {
        result = await create({
          title: values.title,
          description: values.description,
          start_date: values.start_date,
          delivery_date: values.delivery_date,
          academic_period: values.academic_period,
        });
      }
      if (
        createInterdisciplinaryProject.fulfilled.match(result) ||
        updateInterdisciplinaryProject.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingInterdisciplinaryProject, create, update, closeModal],
  );

  return { isOpen, isEdit, editingInterdisciplinaryProject, openModal, closeModal, handleSubmit };
};
