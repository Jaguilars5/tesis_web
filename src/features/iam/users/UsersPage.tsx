import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useUserController } from "./hooks/useUserController";
import { useUserForm } from "./hooks/useUserForm";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { UsersDeleteModal } from "./components/UsersDeleteModal";
import { UsersFormModal } from "./components/UsersFormModal";
import { UsersTable } from "./components/UsersTable";
import { UsersViewModal } from "./components/UsersViewModal";
import { USER_PERMISSIONS } from "./users.constants";
import type { UserT } from "./users.types";

export default function UsersPage() {
  const {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
  } = useUserController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleCreate,
    handleUpdate,
  } = useUserForm({ create: createUser, update: updateUser });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<UserT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState<UserT | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const userPermissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(userPermissions, USER_PERMISSIONS.CREATE);
  const canEdit = hasPermission(userPermissions, USER_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userPermissions, USER_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: UserT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((entity: UserT) => {
    setDeletingItem(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingItem(null);
  }, []);

  const openPasswordModal = useCallback((entity: UserT) => {
    setChangingPassword(entity);
    setIsPasswordOpen(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setIsPasswordOpen(false);
    setChangingPassword(null);
  }, []);

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
          <h1 className="text-2xl font-extrabold text-slate-800">Usuarios</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona los usuarios del sistema</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
            <Plus className="size-4" />
            Nuevo Usuario
          </button>
        )}
      </div>

      <UsersTable
        data={users}
        isLoading={isLoading}
        loadData={loadUsers}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        onChangePassword={openPasswordModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <UsersFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingItem={editingItem}
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
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteUser}
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
