import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { TEACHER_SUBJECT_SECTION_PERMISSIONS } from "./teacher-subject-section.constants";
import { useTeacherSubjectSectionController } from "./hooks/useTeacherSubjectSectionController";
import { useTeacherSubjectSectionForm } from "./hooks/useTeacherSubjectSectionForm";
import { useUserOptions } from "./hooks/useUserOptions";
import { useSubjectOfferingOptions } from "./hooks/useSubjectOfferingOptions";
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
    totalCount,
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

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, TEACHER_SUBJECT_SECTION_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, TEACHER_SUBJECT_SECTION_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, TEACHER_SUBJECT_SECTION_PERMISSIONS.DELETE);

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
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nueva Asignacion
          </button>
        )}
      </div>

      <TeacherSubjectSectionTable
        teacherSubjectSections={teacherSubjectSections}
        totalCount={totalCount}
        isLoading={isLoading}
        loadTeacherSubjectSections={loadTeacherSubjectSections}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <TeacherSubjectSectionFormModal
        key={editingTeacherSubjectSection?.id ?? "create"}
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
        entityId={viewingId}
        onClose={closeViewModal}
      />

      <TeacherSubjectSectionDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingAssignment}
        onClose={closeDeleteModal}
        onSoftDelete={deleteTeacherSubjectSection}
      />
    </div>
  );
}
