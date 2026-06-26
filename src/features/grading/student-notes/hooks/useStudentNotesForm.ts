import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { useCallback, useState } from "react";
import type {
  StudentNoteFormValues,
  StudentNoteT,
} from "../student-notes.types";
import type { StudentNotesControllerT } from "./useStudentNotesController";

interface UseFormArgs {
  create: StudentNotesControllerT["createStudentNote"];
  update: StudentNotesControllerT["updateStudentNote"];
}

export const useStudentNotesForm = ({
  create,
  update,
}: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentNoteT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editingItem;

  const openModal = useCallback((entity?: StudentNoteT) => {
    setEditingItem(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: StudentNoteFormValues) => {
      setSubmitErrors({ general: [], validation: {} });

      if (editingItem) {
        const result = await unwrapMutation(
          {
            id: editingItem.id,
            data: {
              enrollment: values.enrollment === "" ? undefined : values.enrollment,
              evaluative_activity: values.evaluative_activity === "" ? undefined : values.evaluative_activity,
              grading_mode: values.grading_mode,
              numeric_score: values.numeric_score,
              qualitative_scale: values.qualitative_scale === "" ? null : values.qualitative_scale,
              teacher_observation: values.teacher_observation,
            },
          },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const {
          enrollment,
          evaluative_activity,
          grading_mode,
          numeric_score,
          qualitative_scale,
          teacher_observation,
        } = values;
        const result = await unwrapMutation(
          {
            enrollment: enrollment as number,
            evaluative_activity: evaluative_activity as number,
            grading_mode,
            numeric_score,
            qualitative_scale: qualitative_scale === "" ? null : qualitative_scale,
            teacher_observation,
          },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingItem, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
