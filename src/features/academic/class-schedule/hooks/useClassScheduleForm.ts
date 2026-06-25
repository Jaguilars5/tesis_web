import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { ClassScheduleControllerT } from "./useClassScheduleController";
import type {
  ClassScheduleFormValues,
  ClassScheduleT,
} from "../class-schedule.types";

interface UseClassScheduleFormArgs {
  create: ClassScheduleControllerT["createClassSchedule"];
  update: ClassScheduleControllerT["updateClassSchedule"];
}

export const useClassScheduleForm = ({
  create,
  update,
}: UseClassScheduleFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<ClassScheduleT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((classSchedule?: ClassScheduleT) => {
    setEditing(classSchedule ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: ClassScheduleFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const { teacher_subject_section, day_of_week, start_time, end_time } =
        values;

      if (editing) {
        const response = await unwrapMutation(
          {
            id: editing.id,
            data: { teacher_subject_section, day_of_week, start_time, end_time },
          },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
        return;
      }

      const response = await unwrapMutation(
        { teacher_subject_section, day_of_week, start_time, end_time },
        create,
      );
      if (response.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(response.errors);
    },
    [editing, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingClassSchedule: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
