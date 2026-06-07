import { useCallback, useState } from "react";
import { createSubjectProject } from "../../reducers/subject-project.reducer";
import { useSubjectProjectController } from "./useSubjectProjectController";

export interface SubjectProjectFormValues {
  interdisciplinary_project: number;
  subject_offering: number;
}

export const useSubjectProjectForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { createSubjectProject: create } = useSubjectProjectController();

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (values: SubjectProjectFormValues) => {
      const result = await create(values);
      if (createSubjectProject.fulfilled.match(result)) {
        closeModal();
      }
    },
    [create, closeModal],
  );

  return { isOpen, isEdit: false, editingSubjectProject: null, openModal, closeModal, handleSubmit };
};
