import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useAbsenceTypeController,
  useAbsenceTypeForm,
} from "./absence-type.controller";
import { AbsenceTypeDeleteModal } from "./components/AbsenceTypeDeleteModal";
import { AbsenceTypeFormModal } from "./components/AbsenceTypeFormModal";
import { AbsenceTypeTable } from "./components/AbsenceTypeTable";
import { AbsenceTypeViewModal } from "./components/AbsenceTypeViewModal";

import type { AbsenceTypeT } from "./absence-type.types";

export default function AbsenceTypesPage() {
  const {
    absenceTypes,
    isLoading,
    loadAbsenceTypes,
    createAbsenceType,
    updateAbsenceType,
    deleteAbsenceType,
  } = useAbsenceTypeController();

  const {
    isOpen,
    isEdit,
    editingAbsenceType,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAbsenceTypeForm({ create: createAbsenceType, update: updateAbsenceType });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingAbsenceType, setDeletingAbsenceType] = useState<AbsenceTypeT | null>(null);
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
    setDeletingAbsenceType(absenceType);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingAbsenceType(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await deleteAbsenceType(id);
    },
    [deleteAbsenceType],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tipos de Ausencia</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los tipos de ausencia
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Tipo de Ausencia
        </button>
      </div>

      <AbsenceTypeTable
        absenceTypes={absenceTypes}
        isLoading={isLoading}
        loadAbsenceTypes={loadAbsenceTypes}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <AbsenceTypeFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAbsenceType={editingAbsenceType}
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
        absenceType={deletingAbsenceType}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
