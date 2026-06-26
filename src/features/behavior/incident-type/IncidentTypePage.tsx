import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useIncidentTypeController } from "./hooks/useIncidentTypeController";
import { useIncidentTypeForm } from "./hooks/useIncidentTypeForm";
import { IncidentTypeDeleteModal } from "./components/IncidentTypeDeleteModal";
import { IncidentTypeFormModal } from "./components/IncidentTypeFormModal";
import { IncidentTypeTable } from "./components/IncidentTypeTable";
import { IncidentTypeViewModal } from "./components/IncidentTypeViewModal";

import type { IncidentTypeT } from "./incident-type.types";
import { INCIDENT_TYPE_PERMISSIONS } from "./incident-type.constants";

export default function IncidentTypesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, INCIDENT_TYPE_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, INCIDENT_TYPE_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, INCIDENT_TYPE_PERMISSIONS.DELETE);

  const { items, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useIncidentTypeController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useIncidentTypeForm({ create: createItem, update: updateItem });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<IncidentTypeT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: IncidentTypeT) => { setViewingId(s.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openDeleteModal = useCallback((s: IncidentTypeT) => { setDeletingItem(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeletingItem(null); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tipos de Incidente</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona los tipos de incidentes de conducta</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
            <Plus className="size-4" />Nuevo Tipo
          </button>
        )}
      </div>

      <IncidentTypeTable
        incidentTypes={items}
        isLoading={isLoading}
        loadIncidentTypes={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <IncidentTypeFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingIncidentType={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <IncidentTypeViewModal
        isOpen={isViewOpen}
        incidentTypeId={viewingId}
        onClose={closeViewModal}
      />

      <IncidentTypeDeleteModal
        isOpen={isDeleteOpen}
        incidentType={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteItem}
      />
    </div>
  );
}
