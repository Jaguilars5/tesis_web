import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { SUBJECT_PERMISSIONS } from "./subject.constants";
import { useSubjectController } from "./hooks/useSubjectController";
import { useSubjectForm } from "./hooks/useSubjectForm";
import { SubjectDeleteModal } from "./components/SubjectDeleteModal";
import { SubjectFormModal } from "./components/SubjectFormModal";
import { SubjectTable } from "./components/SubjectTable";
import { SubjectViewModal } from "./components/SubjectViewModal";

import type { SubjectT } from "./subject.types";

export default function SubjectsPage() {
  const {
    subjects,
    totalCount,
    isLoading,
    loadSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjectController();

  const {
    isOpen,
    isEdit,
    editingSubject,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useSubjectForm({ create: createSubject, update: updateSubject });

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, SUBJECT_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, SUBJECT_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, SUBJECT_PERMISSIONS.DELETE);

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingEntity, setDeletingEntity] = useState<SubjectT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((subject: SubjectT) => {
    setViewingId(subject.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((subject: SubjectT) => {
    setDeletingEntity(subject);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingEntity(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Materias</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las materias del sistema académico
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nueva Materia
          </button>
        )}
      </div>

      <SubjectTable
        subjects={subjects}
        totalCount={totalCount}
        isLoading={isLoading}
        loadSubjects={loadSubjects}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <SubjectFormModal
        key={editingSubject?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingSubject={editingSubject}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <SubjectViewModal
        isOpen={isViewOpen}
        subjectId={viewingId}
        onClose={closeViewModal}
      />

      <SubjectDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingEntity}
        onClose={closeDeleteModal}
        onSoftDelete={deleteSubject}
      />
    </div>
  );
}
