import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useEarlyAlertController,
  useEarlyAlertForm,
} from "./early-alerts.controller";
import { EarlyAlertDeleteModal } from "./components/EarlyAlertDeleteModal";
import { EarlyAlertFormModal } from "./components/EarlyAlertFormModal";
import { EarlyAlertMarkAttendedModal } from "./components/EarlyAlertMarkAttendedModal";
import { EarlyAlertTable } from "./components/EarlyAlertTable";
import { EarlyAlertViewModal } from "./components/EarlyAlertViewModal";

import type { EarlyAlertT } from "./early-alerts.types";

export default function EarlyAlertPage() {
  const { items, isLoading, loadItems, create, update, remove, markAttended } =
    useEarlyAlertController();
  const {
    isOpen,
    isEdit,
    editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useEarlyAlertForm({ create, update });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<EarlyAlertT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [markingAttended, setMarkingAttended] = useState<EarlyAlertT | null>(
    null,
  );
  const [isMarkAttendedOpen, setIsMarkAttendedOpen] = useState(false);

  const openViewModal = useCallback((entity: EarlyAlertT) => {
    setViewingId(entity.id);
    setIsViewOpen(true);
  }, []);
  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);
  const openDeleteModal = useCallback((entity: EarlyAlertT) => {
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
  const openMarkAttended = useCallback((entity: EarlyAlertT) => {
    setMarkingAttended(entity);
    setIsMarkAttendedOpen(true);
  }, []);
  const closeMarkAttended = useCallback(() => {
    setIsMarkAttendedOpen(false);
    setMarkingAttended(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Alertas Tempranas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las alertas tempranas del sistema
          </p>
        </div>
        {/* <button type="button" onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover">
          <Plus className="size-4" />
          Nueva Alerta
        </button> */}
      </div>

      <EarlyAlertTable
        data={items}
        isLoading={isLoading}
        loadData={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        onMarkAttended={openMarkAttended}
      />

      <EarlyAlertFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editing={editing}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <EarlyAlertViewModal
        isOpen={isViewOpen}
        entityId={viewingId}
        onClose={closeViewModal}
      />

      <EarlyAlertDeleteModal
        isOpen={isDeleteOpen}
        entity={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      <EarlyAlertMarkAttendedModal
        isOpen={isMarkAttendedOpen}
        entity={markingAttended}
        onClose={closeMarkAttended}
        onMarkAttended={markAttended}
      />
    </div>
  );
}
