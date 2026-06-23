import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useActivityTypesController, useActivityTypesForm } from "./activity-types.controller";
import { ActivityTypeDeleteModal } from "./components/ActivityTypeDeleteModal";
import { ActivityTypesFormModal } from "./components/ActivityTypesFormModal";
import { ActivityTypesTable } from "./components/ActivityTypesTable";
import { ActivityTypeViewModal } from "./components/ActivityTypeViewModal";
import type { ActivityTypeT } from "./activity-types.types";

export default function ActivityTypesPage() {
  const { activityTypes, isLoading, loadActivityTypes, createActivityType, updateActivityType, deleteActivityType } = useActivityTypesController();
  const { isOpen, isEdit, editingActivityType, submitErrors, openModal, closeModal, handleSubmit } = useActivityTypesForm({ create: createActivityType, update: updateActivityType });
  const [viewingActivityType, setViewingActivityType] = useState<ActivityTypeT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingActivityType, setDeletingActivityType] = useState<ActivityTypeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openViewModal = useCallback((s: ActivityTypeT) => { setViewingActivityType(s); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setViewingActivityType(null); setIsViewOpen(false); }, []);
  const openDeleteModal = useCallback((s: ActivityTypeT) => { setDeletingActivityType(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setDeletingActivityType(null); setIsDeleteOpen(false); }, []);
  const handleDelete = useCallback(async (id: number) => { await deleteActivityType(id); }, [deleteActivityType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Tipos de Actividad</h1><p className="mt-1 text-sm text-slate-500">Gestiona los tipos de actividad académica</p></div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><Plus className="size-4" />Nuevo Tipo</button>
      </div>
      <ActivityTypesTable activityTypes={activityTypes} isLoading={isLoading} loadActivityTypes={loadActivityTypes} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} />
      <ActivityTypesFormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingActivityType={editingActivityType} onSubmit={handleSubmit} submitErrors={submitErrors} />
      <ActivityTypeViewModal isOpen={isViewOpen} activityTypeId={viewingActivityType?.id ?? null} onClose={closeViewModal} />
      <ActivityTypeDeleteModal isOpen={isDeleteOpen} activityType={deletingActivityType} onClose={closeDeleteModal} onConfirm={handleDelete} />
    </div>
  );
}
