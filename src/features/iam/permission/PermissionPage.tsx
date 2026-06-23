import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  usePermissionController,
  usePermissionForm,
} from "./permission.controller";
import { PermissionDeleteModal } from "./components/PermissionDeleteModal";
import { PermissionFormModal } from "./components/PermissionFormModal";
import { PermissionTable } from "./components/PermissionTable";
import { PermissionViewModal } from "./components/PermissionViewModal";

import type { PermissionT } from "./permission.types";

export default function PermissionPage() {
  const {
    items,
    isLoading,
    loadItems,
    create,
    update,
    remove,
  } = usePermissionController();

  const {
    isOpen,
    isEdit,
    editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = usePermissionForm({ create, update });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deleting, setDeleting] = useState<PermissionT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((entity: PermissionT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((entity: PermissionT) => {
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
            Permisos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los permisos del sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Permiso
        </button>
      </div>

      <PermissionTable
        data={items}
        isLoading={isLoading}
        loadData={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <PermissionFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editing={editing}
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
        entity={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
