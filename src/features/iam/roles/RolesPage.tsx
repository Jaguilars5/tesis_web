import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useRoleController,
  useRoleForm,
} from "./roles.controller";
import { RolesDeleteModal } from "./components/RolesDeleteModal";
import { RolesFormModal } from "./components/RolesFormModal";
import { RolesTable } from "./components/RolesTable";
import { RolesViewModal } from "./components/RolesViewModal";

import type { RoleT } from "./roles.types";

export default function RolesPage() {
  const {
    items,
    isLoading,
    loadItems,
    create,
    update,
    remove,
    assignPermissions,
  } = useRoleController();

  const {
    isOpen,
    isEdit,
    editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useRoleForm({ create, update });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deleting, setDeleting] = useState<RoleT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((entity: RoleT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((entity: RoleT) => {
    setDeleting(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeleting(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await remove(id);
    },
    [remove],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Roles
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los roles y sus permisos
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Rol
        </button>
      </div>

      <RolesTable
        data={items}
        isLoading={isLoading}
        loadData={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <RolesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editing={editing}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        roleId={editing?.id ?? null}
        assignPermissions={assignPermissions}
      />

      <RolesViewModal
        isOpen={isViewOpen}
        entityId={viewingId}
        onClose={closeViewModal}
      />

      <RolesDeleteModal
        isOpen={isDeleteOpen}
        entity={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
