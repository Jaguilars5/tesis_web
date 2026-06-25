import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useAcademicLevelForm } from "./hooks/useAcademicLevelForm";
import { useAcademicLevelController } from "./hooks/useAcademicLevelController";
import { AcademicLevelDeleteModal } from "./components/AcademicLevelDeleteModal";
import { AcademicLevelFormModal } from "./components/AcademicLevelFormModal";
import { AcademicLevelTable } from "./components/AcademicLevelTable";
import { AcademicLevelViewModal } from "./components/AcademicLevelViewModal";
import { ACADEMIC_LEVEL_PERMISSIONS } from "./academic-level.constants";
import type {
  AcademicLevelDeleteParamsT,
  AcademicLevelT,
} from "./academic-level.types";

export default function AcademicLevelsPage() {
  const {
    academicLevels,
    isLoading,
    loadAcademicLevels,
    createAcademicLevel,
    updateAcademicLevel,
    deleteAcademicLevel,
  } = useAcademicLevelController();
  const {
    isOpen,
    isEdit,
    editingAcademicLevel,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAcademicLevelForm({
    create: createAcademicLevel,
    update: updateAcademicLevel,
  });
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, ACADEMIC_LEVEL_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, ACADEMIC_LEVEL_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, ACADEMIC_LEVEL_PERMISSIONS.DELETE);
  const [viewing, setViewing] = useState<AcademicLevelT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<AcademicLevelT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openViewModal = useCallback((l: AcademicLevelT) => {
    setViewing(l);
    setIsViewOpen(true);
  }, []);
  const closeViewModal = useCallback(() => {
    setViewing(null);
    setIsViewOpen(false);
  }, []);
  const openDeleteModal = useCallback((l: AcademicLevelT) => {
    setDeleting(l);
    setIsDeleteOpen(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setDeleting(null);
    setIsDeleteOpen(false);
  }, []);
  const handleDeleteConfirm = useCallback(
    async (params: AcademicLevelDeleteParamsT) => {
      try {
        await deleteAcademicLevel(params);
      } catch (error) {
        console.error(error);
      }
    },
    [deleteAcademicLevel],
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Niveles Académicos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los niveles académicos
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nuevo Nivel
          </button>
        )}
      </div>
      <AcademicLevelTable
        academicLevels={academicLevels}
        isLoading={isLoading}
        loadAcademicLevels={loadAcademicLevels}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />
      <AcademicLevelFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAcademicLevel={editingAcademicLevel}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />
      <AcademicLevelViewModal
        isOpen={isViewOpen}
        academicLevelId={viewing?.id ?? null}
        onClose={closeViewModal}
      />
      <AcademicLevelDeleteModal
        isOpen={isDeleteOpen}
        academicLevel={deleting}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteConfirm({ id: deleting?.id ?? 0 })}
      />
    </div>
  );
}
