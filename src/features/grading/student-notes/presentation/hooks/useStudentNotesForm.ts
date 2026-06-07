import { useCallback, useState } from "react";
import { createStudentNote, updateStudentNote } from "../../reducers/student-notes.thunks";
import { useStudentNotesController } from "./useStudentNotesController";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

export interface StudentNoteFormValues {
  enrollment: number | "";
  evaluative_activity: number | "";
  grade_type: number | "";
  numeric_score: number | null;
  qualitative_scale: number | "";
  sync_status: string;
  teacher_observation: string;
  manually_overridden: boolean;
}

export const useStudentNotesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingStudentNote, setEditingStudentNote] = useState<StudentNoteT | null>(null);
  const isEdit = !!editingStudentNote;

  const { createStudentNote: create, updateStudentNote: update } = useStudentNotesController();

  const openModal = useCallback((studentNote?: StudentNoteT) => {
    setEditingStudentNote(studentNote ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingStudentNote(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: StudentNoteFormValues) => {
      let result;
      if (editingStudentNote) {
        result = await update({
          enrollment: values.enrollment === "" ? undefined : values.enrollment,
          evaluative_activity: values.evaluative_activity === "" ? undefined : values.evaluative_activity,
          grade_type: values.grade_type === "" ? undefined : values.grade_type,
          numeric_score: values.numeric_score ?? undefined,
          qualitative_scale: values.qualitative_scale === "" ? undefined : values.qualitative_scale,
          sync_status: values.sync_status,
          teacher_observation: values.teacher_observation || undefined,
          manually_overridden: values.manually_overridden,
          id: editingStudentNote.id,
        });
      } else {
        result = await create({
          enrollment: values.enrollment === "" ? undefined : values.enrollment,
          evaluative_activity: values.evaluative_activity === "" ? undefined : values.evaluative_activity,
          grade_type: values.grade_type === "" ? undefined : values.grade_type,
          numeric_score: values.numeric_score ?? undefined,
          qualitative_scale: values.qualitative_scale === "" ? undefined : values.qualitative_scale,
          sync_status: values.sync_status,
          teacher_observation: values.teacher_observation || undefined,
          manually_overridden: values.manually_overridden,
        });
      }
      if (
        createStudentNote.fulfilled.match(result) ||
        updateStudentNote.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingStudentNote, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingStudentNote,
    openModal,
    closeModal,
    handleSubmit,
  };
};
