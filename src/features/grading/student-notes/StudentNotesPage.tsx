import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useStudentNotesController } from "./hooks/useStudentNotesController";
import { useStudentNotesForm } from "./hooks/useStudentNotesForm";
import { useStudentNoteOptions } from "./hooks/useStudentNoteOptions";
import { StudentNoteDeleteModal } from "./components/StudentNoteDeleteModal";
import { StudentNotesFormModal } from "./components/StudentNotesFormModal";
import { StudentNotesTable } from "./components/StudentNotesTable";
import { StudentNoteViewModal } from "./components/StudentNoteViewModal";
import { STUDENT_NOTES_PERMISSIONS } from "./student-notes.constants";
import type { StudentNoteT } from "./student-notes.types";

export default function StudentNotesPage() {
  const {
    studentNotes,
    isLoading,
    loadStudentNotes,
    createStudentNote,
    updateStudentNote,
    deleteStudentNote,
  } = useStudentNotesController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useStudentNotesForm({
    create: createStudentNote,
    update: updateStudentNote,
  });

  const {
    enrollmentOptions,
    evaluativeActivityOptions,
    gradeTypeOptions,
    qualitativeScaleOptions,
  } = useStudentNoteOptions();

  const [viewingItem, setViewingItem] = useState<StudentNoteT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StudentNoteT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, STUDENT_NOTES_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, STUDENT_NOTES_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, STUDENT_NOTES_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: StudentNoteT) => {
    setViewingItem(entity);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingItem(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((entity: StudentNoteT) => {
    setDeletingItem(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingItem(null);
    setIsDeleteOpen(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Notas de Estudiantes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las notas académicas de los estudiantes
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nueva Nota
          </button>
        )}
      </div>

      <StudentNotesTable
        studentNotes={studentNotes}
        isLoading={isLoading}
        loadStudentNotes={loadStudentNotes}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <StudentNotesFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        enrollmentOptions={enrollmentOptions}
        evaluativeActivityOptions={evaluativeActivityOptions}
        gradeTypeOptions={gradeTypeOptions}
        qualitativeScaleOptions={qualitativeScaleOptions}
      />

      <StudentNoteViewModal
        isOpen={isViewOpen}
        studentNoteId={viewingItem?.id ?? null}
        onClose={closeViewModal}
      />

      <StudentNoteDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteStudentNote}
      />
    </div>
  );
}
