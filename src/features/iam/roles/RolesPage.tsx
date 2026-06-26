import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useRoleController } from "./hooks/useRoleController";
import { useRoleForm } from "./hooks/useRoleForm";
import { RolesDeleteModal } from "./components/RolesDeleteModal";
import { RolesFormModal } from "./components/RolesFormModal";
import { RolesTable } from "./components/RolesTable";
import { RolesViewModal } from "./components/RolesViewModal";
import { ROLE_PERMISSIONS } from "./roles.constants";
import type { RoleT } from "./roles.types";

export default function RolesPage() {
  const {
    roles,
    isLoading,
    loadRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  } = useRoleController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useRoleForm({ create: createRole, update: updateRole });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<RoleT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const userPermissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(userPermissions, ROLE_PERMISSIONS.CREATE);
  const canEdit = hasPermission(userPermissions, ROLE_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userPermissions, ROLE_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: RoleT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((entity: RoleT) => {
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
          <h1 className="text-2xl font-extrabold text-slate-800">Roles</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los roles y sus permisos
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Rol
          </button>
        )}
      </div>

      <RolesTable
        data={roles}
        isLoading={isLoading}
        loadData={loadRoles}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <RolesFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        roleId={editingItem?.id ?? null}
        assignPermissions={assignPermissions}
      />

      <RolesViewModal
        isOpen={isViewOpen}
        entityId={viewingId}
        onClose={closeViewModal}
      />

      <RolesDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteRole}
      />
    </div>
  );
}
