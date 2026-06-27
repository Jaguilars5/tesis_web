import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useSeverityController } from "./hooks/useSeverityController";
import { useSeverityForm } from "./hooks/useSeverityForm";
import { SeverityDeleteModal } from "./components/SeverityDeleteModal";
import { SeverityFormModal } from "./components/SeverityFormModal";
import { SeverityTable } from "./components/SeverityTable";
import { SeverityViewModal } from "./components/SeverityViewModal";

import type { SeverityT } from "./severity.types";
import { SEVERITY_PERMISSIONS } from "./severity.constants";

export default function SeveritiesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, SEVERITY_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, SEVERITY_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, SEVERITY_PERMISSIONS.DELETE);

  const { items, totalCount, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useSeverityController();

  const { isOpen, isEdit, editingItem, submitErrors, openModal, closeModal, handleSubmit } =
    useSeverityForm({ create: createItem, update: updateItem });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<SeverityT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: SeverityT) => { setViewingId(s.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openDeleteModal = useCallback((s: SeverityT) => { setDeletingItem(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeletingItem(null); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Severidades</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona las severidades de incidentes</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
            <Plus className="size-4" />Nueva Severidad
          </button>
        )}
      </div>

      <SeverityTable severities={items} isLoading={isLoading} loadSeverities={loadItems} totalCount={totalCount} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} canEdit={canEdit} canDelete={canDelete} />

      <SeverityFormModal key={editingItem?.id ?? "create"} isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingSeverity={editingItem} onSubmit={handleSubmit} submitErrors={submitErrors} />

      <SeverityViewModal isOpen={isViewOpen} severityId={viewingId} onClose={closeViewModal} />

      <SeverityDeleteModal isOpen={isDeleteOpen} severity={deletingItem} onClose={closeDeleteModal} onSoftDelete={deleteItem} />
    </div>
  );
}
