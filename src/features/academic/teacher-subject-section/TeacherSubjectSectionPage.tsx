import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useTeacherSubjectSectionController,
  useTeacherSubjectSectionForm,
} from "./teacher-subject-section.controller";
import {
  useSubjectOfferingOptions,
  useUserOptions,
} from "./teacher-subject-section.options";
import { TeacherSubjectSectionDeleteModal } from "./components/TeacherSubjectSectionDeleteModal";
import { TeacherSubjectSectionFormModal } from "./components/TeacherSubjectSectionFormModal";
import { TeacherSubjectSectionTable } from "./components/TeacherSubjectSectionTable";
import { TeacherSubjectSectionViewModal } from "./components/TeacherSubjectSectionViewModal";

import type { TeacherSubjectSectionT } from "./teacher-subject-section.types";

export default function TeacherSubjectSectionsPage() {
  const { userOptions } = useUserOptions();
  const { subjectOfferingOptions } = useSubjectOfferingOptions();

  const {
    teacherSubjectSections,
    isLoading,
    loadTeacherSubjectSections,
    createTeacherSubjectSection,
    updateTeacherSubjectSection,
    deleteTeacherSubjectSection,
  } = useTeacherSubjectSectionController();

  const {
    isOpen,
    isEdit,
    editingTeacherSubjectSection,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useTeacherSubjectSectionForm({
    create: createTeacherSubjectSection,
    update: updateTeacherSubjectSection,
  });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingAssignment, setDeletingAssignment] =
    useState<TeacherSubjectSectionT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((assignment: TeacherSubjectSectionT) => {
    setViewingId(assignment.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((assignment: TeacherSubjectSectionT) => {
    setDeletingAssignment(assignment);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingAssignment(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await deleteTeacherSubjectSection(id);
    },
    [deleteTeacherSubjectSection],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Asignacion Docente-Materia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Asigna docentes a ofertas de materia
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nueva Asignacion
        </button>
      </div>

      <TeacherSubjectSectionTable
        teacherSubjectSections={teacherSubjectSections}
        isLoading={isLoading}
        loadTeacherSubjectSections={loadTeacherSubjectSections}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <TeacherSubjectSectionFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingTeacherSubjectSection={editingTeacherSubjectSection}
        userOptions={userOptions}
        subjectOfferingOptions={subjectOfferingOptions}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <TeacherSubjectSectionViewModal
        isOpen={isViewOpen}
        assignmentId={viewingId}
        onClose={closeViewModal}
      />

      <TeacherSubjectSectionDeleteModal
        isOpen={isDeleteOpen}
        assignment={deletingAssignment}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
