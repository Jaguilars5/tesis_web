import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { PERIOD_TYPE_PERMISSIONS } from "./period-types.constants";
import { usePeriodTypeController } from "./hooks/usePeriodTypeController";
import { usePeriodTypeForm } from "./hooks/usePeriodTypeForm";
import { PeriodTypeDeleteModal } from "./components/PeriodTypeDeleteModal";
import { PeriodTypeFormModal } from "./components/PeriodTypeFormModal";
import { PeriodTypeTable } from "./components/PeriodTypeTable";
import { PeriodTypeViewModal } from "./components/PeriodTypeViewModal";

import type { PeriodTypeT } from "./period-types.types";

export default function PeriodTypesPage() {
  const {
    periodTypes,
    isLoading,
    loadPeriodTypes,
    createPeriodType,
    updatePeriodType,
    deletePeriodType,
  } = usePeriodTypeController();

  const {
    isOpen,
    isEdit,
    editingPeriodType,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = usePeriodTypeForm({
    create: createPeriodType,
    update: updatePeriodType,
  });

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, PERIOD_TYPE_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, PERIOD_TYPE_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, PERIOD_TYPE_PERMISSIONS.DELETE);

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingEntity, setDeletingEntity] =
    useState<PeriodTypeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((periodType: PeriodTypeT) => {
    setViewingId(periodType.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((periodType: PeriodTypeT) => {
    setDeletingEntity(periodType);
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
            Tipos de Periodo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los tipos de periodo académico
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Tipo de Periodo
          </button>
        )}
      </div>

      <PeriodTypeTable
        periodTypes={periodTypes}
        isLoading={isLoading}
        loadPeriodTypes={loadPeriodTypes}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <PeriodTypeFormModal
        key={editingPeriodType?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingPeriodType={editingPeriodType}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <PeriodTypeViewModal
        isOpen={isViewOpen}
        periodTypeId={viewingId}
        onClose={closeViewModal}
      />

      <PeriodTypeDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingEntity}
        onClose={closeDeleteModal}
        onSoftDelete={deletePeriodType}
      />
    </div>
  );
}
