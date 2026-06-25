import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type {
  TeacherSubjectSectionControllerT,
} from "./useTeacherSubjectSectionController";
import type {
  TeacherSubjectSectionFormValues,
  TeacherSubjectSectionT,
} from "../teacher-subject-section.types";

interface UseTeacherSubjectSectionFormArgs {
  create: TeacherSubjectSectionControllerT["createTeacherSubjectSection"];
  update: TeacherSubjectSectionControllerT["updateTeacherSubjectSection"];
}

export const useTeacherSubjectSectionForm = ({
  create,
  update,
}: UseTeacherSubjectSectionFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeacherSubjectSection, setEditingTeacherSubjectSection] =
    useState<TeacherSubjectSectionT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editingTeacherSubjectSection;

  const openModal = useCallback((entity?: TeacherSubjectSectionT) => {
    setEditingTeacherSubjectSection(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingTeacherSubjectSection(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: TeacherSubjectSectionFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editingTeacherSubjectSection) {
        const result = await unwrapMutation(
          { id: editingTeacherSubjectSection.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { user, subject_offering } = values;
        const result = await unwrapMutation(
          { user, subject_offering },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingTeacherSubjectSection, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingTeacherSubjectSection,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
