import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useAcademicGradeController } from "./hooks/useAcademicGradeController";
import { useAcademicGradeForm } from "./hooks/useAcademicGradeForm";
import { useAcademicSubLevelOptions } from "./hooks/useAcademicSubLevelOptions";
import { AcademicGradeDeleteModal } from "./components/AcademicGradeDeleteModal";
import { AcademicGradeFormModal } from "./components/AcademicGradeFormModal";
import { AcademicGradeTable } from "./components/AcademicGradeTable";
import { AcademicGradeViewModal } from "./components/AcademicGradeViewModal";
import { ACADEMIC_GRADE_PERMISSIONS } from "./academic-grade.constants";
import type { AcademicGradeT } from "./academic-grade.types";

export default function AcademicGradePage() {
  const {
    academicGrades,
    isLoading,
    loadAcademicGrades,
    createAcademicGrade,
    updateAcademicGrade,
    deleteAcademicGrade,
  } = useAcademicGradeController();
  const {
    isOpen,
    isEdit,
    editingAcademicGrade,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAcademicGradeForm({
    create: createAcademicGrade,
    update: updateAcademicGrade,
  });
  const { academicSubLevelOptions } = useAcademicSubLevelOptions();
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, ACADEMIC_GRADE_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, ACADEMIC_GRADE_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, ACADEMIC_GRADE_PERMISSIONS.DELETE);
  const [viewing, setViewing] = useState<AcademicGradeT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<AcademicGradeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((grade: AcademicGradeT) => {
    setViewing(grade);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewing(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((grade: AcademicGradeT) => {
    setDeleting(grade);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleting(null);
    setIsDeleteOpen(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Grados</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los grados académicos
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nuevo Grado
          </button>
        )}
      </div>
      <AcademicGradeTable
        academicGrades={academicGrades}
        isLoading={isLoading}
        loadAcademicGrades={loadAcademicGrades}
        academicSubLevelOptions={academicSubLevelOptions}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />
      <AcademicGradeFormModal
        key={editingAcademicGrade?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAcademicGrade={editingAcademicGrade}
        academicSubLevelOptions={academicSubLevelOptions}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />
      <AcademicGradeViewModal
        isOpen={isViewOpen}
        academicGradeId={viewing?.id ?? null}
        onClose={closeViewModal}
      />
      <AcademicGradeDeleteModal
        isOpen={isDeleteOpen}
        academicGrade={deleting}
        onClose={closeDeleteModal}
        onSoftDelete={deleteAcademicGrade}
      />
    </div>
  );
}
