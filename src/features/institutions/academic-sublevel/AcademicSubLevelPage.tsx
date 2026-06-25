import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useAcademicSubLevelController } from "./hooks/useAcademicSubLevelController";
import { useAcademicSubLevelForm } from "./hooks/useAcademicSubLevelForm";
import { useAcademicLevelOptions } from "./hooks/useAcademicLevelOptions";
import { AcademicSubLevelDeleteModal } from "./components/AcademicSubLevelDeleteModal";
import { AcademicSubLevelFormModal } from "./components/AcademicSubLevelFormModal";
import { AcademicSubLevelTable } from "./components/AcademicSubLevelTable";
import { AcademicSubLevelViewModal } from "./components/AcademicSubLevelViewModal";
import { ACADEMIC_SUBLEVEL_PERMISSIONS } from "./academic-sublevel.constants";
import type { AcademicSubLevelT } from "./academic-sublevel.types";

export default function AcademicSubLevelsPage() {
  const {
    academicSubLevels,
    isLoading,
    loadAcademicSubLevels,
    createAcademicSubLevel,
    updateAcademicSubLevel,
    deleteAcademicSubLevel,
  } = useAcademicSubLevelController();
  const {
    isOpen,
    isEdit,
    editingAcademicSubLevel,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAcademicSubLevelForm({
    create: createAcademicSubLevel,
    update: updateAcademicSubLevel,
  });
  const { academicLevelOptions } = useAcademicLevelOptions();
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(
    permissions,
    ACADEMIC_SUBLEVEL_PERMISSIONS.CREATE,
  );
  const canEdit = hasPermission(
    permissions,
    ACADEMIC_SUBLEVEL_PERMISSIONS.UPDATE,
  );
  const canDelete = hasPermission(
    permissions,
    ACADEMIC_SUBLEVEL_PERMISSIONS.DELETE,
  );
  const [viewing, setViewing] = useState<AcademicSubLevelT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<AcademicSubLevelT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: AcademicSubLevelT) => {
    setViewing(s);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewing(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((s: AcademicSubLevelT) => {
    setDeleting(s);
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
          <h1 className="text-2xl font-extrabold text-slate-800">
            Subniveles Académicos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los subniveles académicos
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nuevo Subnivel
          </button>
        )}
      </div>
      <AcademicSubLevelTable
        academicSubLevels={academicSubLevels}
        isLoading={isLoading}
        loadAcademicSubLevels={loadAcademicSubLevels}
        academicLevelOptions={academicLevelOptions}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />
      <AcademicSubLevelFormModal
        key={editingAcademicSubLevel?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAcademicSubLevel={editingAcademicSubLevel}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        academicLevelOptions={academicLevelOptions}
      />
      <AcademicSubLevelViewModal
        isOpen={isViewOpen}
        academicSubLevelId={viewing?.id ?? null}
        onClose={closeViewModal}
      />
      <AcademicSubLevelDeleteModal
        isOpen={isDeleteOpen}
        academicSubLevel={deleting}
        onClose={closeDeleteModal}
        onSoftDelete={deleteAcademicSubLevel}
      />
    </div>
  );
}
