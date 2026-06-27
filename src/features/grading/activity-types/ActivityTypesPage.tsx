import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useActivityTypesController } from "./hooks/useActivityTypesController";
import { useActivityTypesForm } from "./hooks/useActivityTypesForm";
import { ActivityTypeDeleteModal } from "./components/ActivityTypeDeleteModal";
import { ActivityTypesFormModal } from "./components/ActivityTypesFormModal";
import { ActivityTypesTable } from "./components/ActivityTypesTable";
import { ActivityTypeViewModal } from "./components/ActivityTypeViewModal";

import type { ActivityTypeT } from "./activity-types.types";
import { ACTIVITY_TYPES_PERMISSIONS } from "./activity-types.constants";

export default function ActivityTypesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(
    permissions,
    ACTIVITY_TYPES_PERMISSIONS.CREATE,
  );
  const canEdit = hasPermission(permissions, ACTIVITY_TYPES_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(
    permissions,
    ACTIVITY_TYPES_PERMISSIONS.DELETE,
  );

  const { items, totalCount, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useActivityTypesController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useActivityTypesForm({ create: createItem, update: updateItem });

  const [viewingItem, setViewingItem] = useState<ActivityTypeT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ActivityTypeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: ActivityTypeT) => {
    setViewingItem(s);
    setIsViewOpen(true);
  }, []);
  const closeViewModal = useCallback(() => {
    setViewingItem(null);
    setIsViewOpen(false);
  }, []);
  const openDeleteModal = useCallback((s: ActivityTypeT) => {
    setDeletingItem(s);
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
            Tipos de Actividad
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los tipos de actividad académica
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Tipo
          </button>
        )}
      </div>

      <ActivityTypesTable
        activityTypes={items}
        totalCount={totalCount}
        isLoading={isLoading}
        loadActivityTypes={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <ActivityTypesFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingActivityType={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <ActivityTypeViewModal
        isOpen={isViewOpen}
        activityTypeId={viewingItem?.id ?? null}
        onClose={closeViewModal}
      />

      <ActivityTypeDeleteModal
        isOpen={isDeleteOpen}
        activityType={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteItem}
      />
    </div>
  );
}
