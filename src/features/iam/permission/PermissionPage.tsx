import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { usePermissionController } from "./hooks/usePermissionController";
import { usePermissionForm } from "./hooks/usePermissionForm";
import { PermissionDeleteModal } from "./components/PermissionDeleteModal";
import { PermissionFormModal } from "./components/PermissionFormModal";
import { PermissionTable } from "./components/PermissionTable";
import { PermissionViewModal } from "./components/PermissionViewModal";
import { PERMISSION_PERMISSIONS } from "./permission.constants";
import type { PermissionT } from "./permission.types";

export default function PermissionPage() {
  const {
    permissions,
    isLoading,
    loadPermissions,
    createPermission,
    updatePermission,
    deletePermission,
  } = usePermissionController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = usePermissionForm({ create: createPermission, update: updatePermission });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PermissionT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const userPermissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(userPermissions, PERMISSION_PERMISSIONS.CREATE);
  const canEdit = hasPermission(userPermissions, PERMISSION_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userPermissions, PERMISSION_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: PermissionT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((entity: PermissionT) => {
    setDeletingItem(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingItem(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Permisos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los permisos del sistema
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Permiso
          </button>
        )}
      </div>

      <PermissionTable
        data={permissions}
        isLoading={isLoading}
        loadData={loadPermissions}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <PermissionFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <PermissionViewModal
        isOpen={isViewOpen}
        entityId={viewingId}
        onClose={closeViewModal}
      />

      <PermissionDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deletePermission}
      />
    </div>
  );
}
