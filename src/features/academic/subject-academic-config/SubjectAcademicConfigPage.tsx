import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useSubjectAcademicConfigController,
  useSubjectAcademicConfigForm,
} from "./subject-academic-config.controller";
import { useAcademicGradeOptions, useSubjectOptions } from "./subject-academic-config.options";
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

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingConfig, setDeletingConfig] =
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
    setDeletingConfig(config);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingConfig(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await deleteSubjectAcademicConfig(id);
    },
    [deleteSubjectAcademicConfig],
  );

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
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nueva Configuracion
        </button>
      </div>

      <SubjectAcademicConfigTable
        subjectAcademicConfigs={subjectAcademicConfigs}
        isLoading={isLoading}
        loadSubjectAcademicConfigs={loadSubjectAcademicConfigs}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <SubjectAcademicConfigFormModal
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
        config={deletingConfig}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
