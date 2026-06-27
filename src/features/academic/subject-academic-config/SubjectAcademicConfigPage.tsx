import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { SUBJECT_ACADEMIC_CONFIG_PERMISSIONS } from "./subject-academic-config.constants";
import { useAcademicGradeOptions } from "./hooks/useAcademicGradeOptions";
import { useSubjectAcademicConfigController } from "./hooks/useSubjectAcademicConfigController";
import { useSubjectAcademicConfigForm } from "./hooks/useSubjectAcademicConfigForm";
import { useSubjectOptions } from "./hooks/useSubjectOptions";
import { SubjectAcademicConfigDeleteModal } from "./components/SubjectAcademicConfigDeleteModal";
import { SubjectAcademicConfigFormModal } from "./components/SubjectAcademicConfigFormModal";
import { SubjectAcademicConfigTable } from "./components/SubjectAcademicConfigTable";
import { SubjectAcademicConfigViewModal } from "./components/SubjectAcademicConfigViewModal";

import type { SubjectAcademicConfigT } from "./subject-academic-config.types";

export default function SubjectAcademicConfigsPage() {
  const { subjectOptions } = useSubjectOptions();
  const { academicGradeOptions } = useAcademicGradeOptions();

  const {
    subjectAcademicConfigs,
    totalCount,
    isLoading,
    loadSubjectAcademicConfigs,
    createSubjectAcademicConfig,
    updateSubjectAcademicConfig,
    deleteSubjectAcademicConfig,
  } = useSubjectAcademicConfigController();

  const {
    isOpen,
    isEdit,
    editingSubjectAcademicConfig,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useSubjectAcademicConfigForm({
    create: createSubjectAcademicConfig,
    update: updateSubjectAcademicConfig,
  });

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(
    permissions,
    SUBJECT_ACADEMIC_CONFIG_PERMISSIONS.CREATE,
  );
  const canEdit = hasPermission(
    permissions,
    SUBJECT_ACADEMIC_CONFIG_PERMISSIONS.UPDATE,
  );
  const canDelete = hasPermission(
    permissions,
    SUBJECT_ACADEMIC_CONFIG_PERMISSIONS.DELETE,
  );

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingEntity, setDeletingEntity] =
    useState<SubjectAcademicConfigT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((config: SubjectAcademicConfigT) => {
    setViewingId(config.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((config: SubjectAcademicConfigT) => {
    setDeletingEntity(config);
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
          <h1 className="text-2xl font-extrabold text-slate-800">
            Configuracion de Materias por Grado
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las horas semanales y materias por grado academico
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nueva Configuracion
          </button>
        )}
      </div>

      <SubjectAcademicConfigTable
        subjectAcademicConfigs={subjectAcademicConfigs}
        totalCount={totalCount}
        isLoading={isLoading}
        loadSubjectAcademicConfigs={loadSubjectAcademicConfigs}
        subjectOptions={subjectOptions}
        academicGradeOptions={academicGradeOptions}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <SubjectAcademicConfigFormModal
        key={editingSubjectAcademicConfig?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingSubjectAcademicConfig={editingSubjectAcademicConfig}
        subjectOptions={subjectOptions}
        academicGradeOptions={academicGradeOptions}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <SubjectAcademicConfigViewModal
        isOpen={isViewOpen}
        configId={viewingId}
        onClose={closeViewModal}
      />

      <SubjectAcademicConfigDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingEntity}
        onClose={closeDeleteModal}
        onSoftDelete={deleteSubjectAcademicConfig}
      />
    </div>
  );
}
