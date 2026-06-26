import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useBlockComponentsController } from "./hooks/useBlockComponentsController";
import { useBlockComponentsForm } from "./hooks/useBlockComponentsForm";
import { BlockComponentDeleteModal } from "./components/BlockComponentDeleteModal";
import { BlockComponentsFormModal } from "./components/BlockComponentsFormModal";
import { BlockComponentsTable } from "./components/BlockComponentsTable";
import { BlockComponentViewModal } from "./components/BlockComponentViewModal";

import type { BlockComponentT } from "./block-components.types";
import { BLOCK_COMPONENTS_PERMISSIONS } from "./block-components.constants";

export default function BlockComponentsPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, BLOCK_COMPONENTS_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, BLOCK_COMPONENTS_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, BLOCK_COMPONENTS_PERMISSIONS.DELETE);

  const { items, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useBlockComponentsController();

  const { isOpen, isEdit, editingItem, submitErrors, openModal, closeModal, handleSubmit } =
    useBlockComponentsForm({ create: createItem, update: updateItem });

  const [viewingItem, setViewingItem] = useState<BlockComponentT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<BlockComponentT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((bc: BlockComponentT) => { setViewingItem(bc); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setViewingItem(null); setIsViewOpen(false); }, []);
  const openDeleteModal = useCallback((bc: BlockComponentT) => { setDeletingItem(bc); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setDeletingItem(null); setIsDeleteOpen(false); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Componentes de Bloque</h1><p className="mt-1 text-sm text-slate-500">Gestiona los componentes de bloque de evaluación</p></div>
        {canCreate && (
          <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><Plus className="size-4" />Nuevo Componente</button>
        )}
      </div>

      <BlockComponentsTable blockComponents={items} isLoading={isLoading} loadBlockComponents={loadItems} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} canEdit={canEdit} canDelete={canDelete} />

      <BlockComponentsFormModal key={editingItem?.id ?? "create"} isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingBlockComponent={editingItem} onSubmit={handleSubmit} submitErrors={submitErrors} />

      <BlockComponentViewModal isOpen={isViewOpen} blockComponentId={viewingItem?.id ?? null} onClose={closeViewModal} />

      <BlockComponentDeleteModal isOpen={isDeleteOpen} blockComponent={deletingItem} onClose={closeDeleteModal} onSoftDelete={deleteItem} />
    </div>
  );
}
