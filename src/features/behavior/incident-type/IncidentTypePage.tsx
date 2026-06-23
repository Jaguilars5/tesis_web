import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useIncidentTypeController, useIncidentTypeForm } from "./incident-type.controller";
import { IncidentTypeDeleteModal } from "./components/IncidentTypeDeleteModal";
import { IncidentTypeFormModal } from "./components/IncidentTypeFormModal";
import { IncidentTypeTable } from "./components/IncidentTypeTable";
import { IncidentTypeViewModal } from "./components/IncidentTypeViewModal";
import type { IncidentTypeT } from "./incident-type.types";

export default function IncidentTypesPage() {
  const { incidentTypes, isLoading, loadIncidentTypes, createIncidentType, updateIncidentType, deleteIncidentType } = useIncidentTypeController();
  const { isOpen, isEdit, editingIncidentType, submitErrors, openModal, closeModal, handleSubmit } = useIncidentTypeForm({ create: createIncidentType, update: updateIncidentType });
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<IncidentTypeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openViewModal = useCallback((s: IncidentTypeT) => { setViewingId(s.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openDeleteModal = useCallback((s: IncidentTypeT) => { setDeleting(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeleting(null); }, []);
  const handleDeleteConfirm = useCallback(async (id: number) => { await deleteIncidentType(id); }, [deleteIncidentType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Tipos de Incidente</h1><p className="mt-1 text-sm text-slate-500">Gestiona los tipos de incidentes de conducta</p></div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><Plus className="size-4" />Nuevo Tipo</button>
      </div>
      <IncidentTypeTable incidentTypes={incidentTypes} isLoading={isLoading} loadIncidentTypes={loadIncidentTypes} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} />
      <IncidentTypeFormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingIncidentType={editingIncidentType} onSubmit={handleSubmit} submitErrors={submitErrors} />
      <IncidentTypeViewModal isOpen={isViewOpen} incidentTypeId={viewingId} onClose={closeViewModal} />
      <IncidentTypeDeleteModal isOpen={isDeleteOpen} incidentType={deleting} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
