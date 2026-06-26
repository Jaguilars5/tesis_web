import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useAbsenceTypeController } from "./hooks/useAbsenceTypeController";
import { useAbsenceTypeForm } from "./hooks/useAbsenceTypeForm";
import { AbsenceTypeDeleteModal } from "./components/AbsenceTypeDeleteModal";
import { AbsenceTypeFormModal } from "./components/AbsenceTypeFormModal";
import { AbsenceTypeTable } from "./components/AbsenceTypeTable";
import { AbsenceTypeViewModal } from "./components/AbsenceTypeViewModal";

import type { AbsenceTypeT } from "./absence-type.types";
import { ABSENCE_TYPE_PERMISSIONS } from "./absence-type.constants";

export default function AbsenceTypesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, ABSENCE_TYPE_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, ABSENCE_TYPE_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, ABSENCE_TYPE_PERMISSIONS.DELETE);

  const { items, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useAbsenceTypeController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAbsenceTypeForm({ create: createItem, update: updateItem });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingItem, setDeletingItem] = useState<AbsenceTypeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((absenceType: AbsenceTypeT) => {
    setViewingId(absenceType.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((absenceType: AbsenceTypeT) => {
    setDeletingItem(absenceType);
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
          <h1 className="text-2xl font-extrabold text-slate-800">Tipos de Ausencia</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los tipos de ausencia
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Tipo de Ausencia
          </button>
        )}
      </div>

      <AbsenceTypeTable
        absenceTypes={items}
        isLoading={isLoading}
        loadAbsenceTypes={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <AbsenceTypeFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAbsenceType={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <AbsenceTypeViewModal
        isOpen={isViewOpen}
        absenceTypeId={viewingId}
        onClose={closeViewModal}
      />

      <AbsenceTypeDeleteModal
        isOpen={isDeleteOpen}
        absenceType={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteItem}
      />
    </div>
  );
}
