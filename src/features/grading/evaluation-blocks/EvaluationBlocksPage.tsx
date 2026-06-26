import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useEvaluationBlockController } from "./hooks/useEvaluationBlockController";
import { useEvaluationBlockForm } from "./hooks/useEvaluationBlockForm";
import { useAcademicPeriodOptions } from "./hooks/useAcademicPeriodOptions";
import { EvaluationBlockDeleteModal } from "./components/EvaluationBlockDeleteModal";
import { EvaluationBlockFormModal } from "./components/EvaluationBlockFormModal";
import { EvaluationBlockTable } from "./components/EvaluationBlockTable";
import { EvaluationBlockViewModal } from "./components/EvaluationBlockViewModal";

import type { EvaluationBlockT } from "./evaluation-blocks.types";
import { EVALUATION_BLOCKS_PERMISSIONS } from "./evaluation-blocks.constants";

export default function EvaluationBlocksPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, EVALUATION_BLOCKS_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, EVALUATION_BLOCKS_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, EVALUATION_BLOCKS_PERMISSIONS.DELETE);

  const { items, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useEvaluationBlockController();

  const { isOpen, isEdit, editingItem, submitErrors, openModal, closeModal, handleSubmit } =
    useEvaluationBlockForm({ create: createItem, update: updateItem });

  const { academicPeriodOptions } = useAcademicPeriodOptions();

  const [viewingItem, setViewingItem] = useState<EvaluationBlockT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<EvaluationBlockT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((eb: EvaluationBlockT) => { setViewingItem(eb); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setViewingItem(null); setIsViewOpen(false); }, []);
  const openDeleteModal = useCallback((eb: EvaluationBlockT) => { setDeletingItem(eb); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setDeletingItem(null); setIsDeleteOpen(false); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Bloques de Evaluación</h1><p className="mt-1 text-sm text-slate-500">Gestiona los bloques de evaluación</p></div>
        {canCreate && (
          <button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"><Plus className="size-4" />Nuevo Bloque</button>
        )}
      </div>

      <EvaluationBlockTable evaluationBlocks={items} isLoading={isLoading} loadEvaluationBlocks={loadItems} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} canEdit={canEdit} canDelete={canDelete} />

      <EvaluationBlockFormModal key={editingItem?.id ?? "create"} isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingEvaluationBlock={editingItem} onSubmit={handleSubmit} submitErrors={submitErrors} academicPeriodOptions={academicPeriodOptions} />

      <EvaluationBlockViewModal isOpen={isViewOpen} evaluationBlockId={viewingItem?.id ?? null} onClose={closeViewModal} />

      <EvaluationBlockDeleteModal isOpen={isDeleteOpen} evaluationBlock={deletingItem} onClose={closeDeleteModal} onSoftDelete={deleteItem} />
    </div>
  );
}
