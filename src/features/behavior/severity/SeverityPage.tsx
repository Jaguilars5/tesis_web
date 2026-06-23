import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useSeverityController, useSeverityForm } from "./severity.controller";
import { SeverityDeleteModal } from "./components/SeverityDeleteModal";
import { SeverityFormModal } from "./components/SeverityFormModal";
import { SeverityTable } from "./components/SeverityTable";
import { SeverityViewModal } from "./components/SeverityViewModal";
import type { SeverityT } from "./severity.types";

export default function SeveritiesPage() {
  const { severities, isLoading, loadSeverities, createSeverity, updateSeverity, deleteSeverity } = useSeverityController();
  const { isOpen, isEdit, editingSeverity, submitErrors, openModal, closeModal, handleSubmit } = useSeverityForm({ create: createSeverity, update: updateSeverity });
  const [viewingId, setViewingId] = useState<number | null>(null); const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<SeverityT | null>(null); const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openViewModal = useCallback((s: SeverityT) => { setViewingId(s.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openDeleteModal = useCallback((s: SeverityT) => { setDeleting(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeleting(null); }, []);
  const handleDeleteConfirm = useCallback(async (id: number) => { await deleteSeverity(id); }, [deleteSeverity]);
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Severidades</h1><p className="mt-1 text-sm text-slate-500">Gestiona las severidades de incidentes</p></div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><Plus className="size-4" />Nueva Severidad</button>
      </div>
      <SeverityTable severities={severities} isLoading={isLoading} loadSeverities={loadSeverities} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} />
      <SeverityFormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingSeverity={editingSeverity} onSubmit={handleSubmit} submitErrors={submitErrors} />
      <SeverityViewModal isOpen={isViewOpen} severityId={viewingId} onClose={closeViewModal} />
      <SeverityDeleteModal isOpen={isDeleteOpen} severity={deleting} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
