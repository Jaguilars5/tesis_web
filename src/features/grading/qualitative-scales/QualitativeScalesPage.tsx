import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useQualitativeScalesController } from "./hooks/useQualitativeScalesController";
import { useQualitativeScalesForm } from "./hooks/useQualitativeScalesForm";
import { QualitativeScaleDeleteModal } from "./components/QualitativeScaleDeleteModal";
import { QualitativeScalesFormModal } from "./components/QualitativeScalesFormModal";
import { QualitativeScalesTable } from "./components/QualitativeScalesTable";
import { QualitativeScaleViewModal } from "./components/QualitativeScaleViewModal";
import { QUALITATIVE_SCALES_PERMISSIONS } from "./qualitative-scales.constants";
import type { QualitativeScaleT } from "./qualitative-scales.types";

export default function QualitativeScalesPage() {
  const {
    qualitativeScales,
    isLoading,
    loadQualitativeScales,
    createQualitativeScale,
    updateQualitativeScale,
    deleteQualitativeScale,
  } = useQualitativeScalesController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useQualitativeScalesForm({
    create: createQualitativeScale,
    update: updateQualitativeScale,
  });

  const [viewingItem, setViewingItem] = useState<QualitativeScaleT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<QualitativeScaleT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, QUALITATIVE_SCALES_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, QUALITATIVE_SCALES_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, QUALITATIVE_SCALES_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: QualitativeScaleT) => {
    setViewingItem(entity);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingItem(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((entity: QualitativeScaleT) => {
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
            Escalas Cualitativas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las escalas de calificación cualitativa
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nueva Escala
          </button>
        )}
      </div>

      <QualitativeScalesTable
        qualitativeScales={qualitativeScales}
        isLoading={isLoading}
        loadQualitativeScales={loadQualitativeScales}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <QualitativeScalesFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <QualitativeScaleViewModal
        isOpen={isViewOpen}
        qualitativeScaleId={viewingItem?.id ?? null}
        onClose={closeViewModal}
      />

      <QualitativeScaleDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteQualitativeScale}
      />
    </div>
  );
}
