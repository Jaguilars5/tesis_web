import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useUserController,
  useUserForm,
} from "./users.controller";
import { UsersDeleteModal } from "./components/UsersDeleteModal";
import { UsersFormModal } from "./components/UsersFormModal";
import { UsersTable } from "./components/UsersTable";
import { UsersViewModal } from "./components/UsersViewModal";
import { ChangePasswordModal } from "./components/ChangePasswordModal";

import type { UserT } from "./users.types";

export default function UsersPage() {
  const {
    items,
    isLoading,
    loadItems,
    create,
    update,
    remove,
    changePassword,
  } = useUserController();

  const {
    isOpen,
    isEdit,
    editing,
    submitErrors,
    openModal,
    closeModal,
    handleCreate,
    handleUpdate,
  } = useUserForm({ create, update });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deleting, setDeleting] = useState<UserT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [changingPassword, setChangingPassword] = useState<UserT | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const openViewModal = useCallback((entity: UserT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((entity: UserT) => {
    setDeleting(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeleting(null);
  }, []);

  const openPasswordModal = useCallback((entity: UserT) => {
    setChangingPassword(entity);
    setIsPasswordOpen(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setIsPasswordOpen(false);
    setChangingPassword(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await remove(id);
    },
    [remove],
  );

  const handleChangePassword = useCallback(
    async (newPassword: string) => {
      if (!changingPassword) return;
      await changePassword(changingPassword.id, newPassword);
    },
    [changingPassword, changePassword],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Usuarios
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Usuario
        </button>
      </div>

      <UsersTable
        data={items}
        isLoading={isLoading}
        loadData={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        onChangePassword={openPasswordModal}
      />

      <UsersFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editing={editing}
        submitErrors={submitErrors}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <UsersViewModal
        isOpen={isViewOpen}
        entityId={viewingId}
        onClose={closeViewModal}
      />

      <UsersDeleteModal
        isOpen={isDeleteOpen}
        entity={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      <ChangePasswordModal
        isOpen={isPasswordOpen}
        entity={changingPassword}
        onClose={closePasswordModal}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
