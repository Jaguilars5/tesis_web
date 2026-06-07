import { useCallback, useState } from "react";
import { createProjectNote, updateProjectNote } from "../../reducers/project-notes.thunks";
import { useProjectNotesController } from "./useProjectNotesController";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";

export interface ProjectNoteFormValues {
  enrollment: number | "";
  interdisciplinary_project: number | "";
  product_score: number | null;
  presentation_score: number | null;
  final_score: number | null;
  observation: string;
  sync_status: string;
}

export const useProjectNotesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProjectNote, setEditingProjectNote] = useState<ProjectNoteT | null>(null);
  const isEdit = !!editingProjectNote;

  const { createProjectNote: create, updateProjectNote: update } = useProjectNotesController();

  const openModal = useCallback((projectNote?: ProjectNoteT) => {
    setEditingProjectNote(projectNote ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingProjectNote(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: ProjectNoteFormValues) => {
      let result;
      if (editingProjectNote) {
        result = await update({
          enrollment: values.enrollment === "" ? undefined : values.enrollment,
          interdisciplinary_project: values.interdisciplinary_project === "" ? undefined : values.interdisciplinary_project,
          product_score: values.product_score ?? undefined,
          presentation_score: values.presentation_score ?? undefined,
          final_score: values.final_score ?? undefined,
          observation: values.observation || undefined,
          sync_status: values.sync_status,
          id: editingProjectNote.id,
        });
      } else {
        result = await create({
          enrollment: values.enrollment as number,
          interdisciplinary_project: values.interdisciplinary_project as number,
          product_score: values.product_score ?? 0,
          presentation_score: values.presentation_score ?? 0,
          final_score: values.final_score ?? 0,
          observation: values.observation || undefined,
          sync_status: values.sync_status,
        });
      }
      if (
        createProjectNote.fulfilled.match(result) ||
        updateProjectNote.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingProjectNote, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingProjectNote,
    openModal,
    closeModal,
    handleSubmit,
  };
};
