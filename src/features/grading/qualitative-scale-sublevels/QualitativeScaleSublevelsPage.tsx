import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { QualitativeScaleSublevelDeleteModal } from "./components/QualitativeScaleSublevelDeleteModal";
import { QualitativeScaleSublevelFormModal } from "./components/QualitativeScaleSublevelFormModal";
import { QualitativeScaleSublevelsTable } from "./components/QualitativeScaleSublevelsTable";
import { QualitativeScaleSublevelViewModal } from "./components/QualitativeScaleSublevelViewModal";
import { useQualitativeScaleSublevelsController } from "./hooks/useQualitativeScaleSublevelsController";
import { useQualitativeScaleSublevelsForm } from "./hooks/useQualitativeScaleSublevelForm";
import { useQualitativeScaleSublevelOptions } from "./hooks/useQualitativeScaleSublevelOptions";
import { QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS } from "./qualitative-scale-sublevels.constants";
import type { QualitativeScaleSublevelT } from "./qualitative-scale-sublevels.types";

export default function QualitativeScaleSublevelsPage() {
  const {
    qualitativeScaleSublevels,
    isLoading,
    loadQualitativeScaleSublevels,
    createQualitativeScaleSublevel,
    updateQualitativeScaleSublevel,
    deleteQualitativeScaleSublevel,
  } = useQualitativeScaleSublevelsController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useQualitativeScaleSublevelsForm({
    create: createQualitativeScaleSublevel,
    update: updateQualitativeScaleSublevel,
  });

  const { scaleOptions, sublevelOptions } = useQualitativeScaleSublevelOptions();

  const [viewingItem, setViewingItem] = useState<QualitativeScaleSublevelT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<QualitativeScaleSublevelT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, QUALITATIVE_SCALE_SUBLEVEL_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: QualitativeScaleSublevelT) => {
    setViewingItem(entity);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingItem(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((entity: QualitativeScaleSublevelT) => {
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
            Escalas por Subnivel
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona la asignación de escalas cualitativas a subniveles
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nueva Asignación
          </button>
        )}
      </div>

      <QualitativeScaleSublevelsTable
        qualitativeScaleSublevels={qualitativeScaleSublevels}
        isLoading={isLoading}
        loadQualitativeScaleSublevels={loadQualitativeScaleSublevels}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <QualitativeScaleSublevelFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        scaleOptions={scaleOptions}
        sublevelOptions={sublevelOptions}
      />

      <QualitativeScaleSublevelViewModal
        isOpen={isViewOpen}
        qualitativeScaleSublevelId={viewingItem?.id ?? null}
        onClose={closeViewModal}
      />

      <QualitativeScaleSublevelDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteQualitativeScaleSublevel}
      />
    </div>
  );
}
