import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { PeriodGradeSummaryDeleteModal } from "./components/PeriodGradeSummaryDeleteModal";
import { PeriodGradeSummariesFormModal } from "./components/PeriodGradeSummariesFormModal";
import { PeriodGradeSummariesTable } from "./components/PeriodGradeSummariesTable";
import { PeriodGradeSummaryViewModal } from "./components/PeriodGradeSummaryViewModal";
import { usePeriodGradeSummariesController } from "./hooks/usePeriodGradeSummariesController";
import { usePeriodGradeSummariesForm } from "./hooks/usePeriodGradeSummaryForm";
import { usePeriodGradeSummaryOptions } from "./hooks/usePeriodGradeSummaryOptions";
import { PERIOD_GRADE_SUMMARIES_PERMISSIONS } from "./period-grade-summaries.constants";
import type { PeriodGradeSummaryT } from "./period-grade-summaries.types";

export default function PeriodGradeSummariesPage() {
  const {
    periodGradeSummaries,
    totalCount,
    isLoading,
    loadPeriodGradeSummaries,
    createPeriodGradeSummary,
    updatePeriodGradeSummary,
    deletePeriodGradeSummary,
  } = usePeriodGradeSummariesController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = usePeriodGradeSummariesForm({
    create: createPeriodGradeSummary,
    update: updatePeriodGradeSummary,
  });

  const {
    enrollmentOptions,
    subjectOfferingOptions,
    academicPeriodOptions,
    qualitativeScaleOptions,
    promotionStatusOptions,
  } = usePeriodGradeSummaryOptions();

  const [viewingItem, setViewingItem] = useState<PeriodGradeSummaryT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PeriodGradeSummaryT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, PERIOD_GRADE_SUMMARIES_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, PERIOD_GRADE_SUMMARIES_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, PERIOD_GRADE_SUMMARIES_PERMISSIONS.DELETE);

  const openViewModal = useCallback((entity: PeriodGradeSummaryT) => {
    setViewingItem(entity);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingItem(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((entity: PeriodGradeSummaryT) => {
    setDeletingItem(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingItem(null);
    setIsDeleteOpen(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Resúmenes de Calificaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los resúmenes de calificaciones por período
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nuevo Resumen
          </button>
        )}
      </div>

      <PeriodGradeSummariesTable
        periodGradeSummaries={periodGradeSummaries}
        totalCount={totalCount}
        isLoading={isLoading}
        loadPeriodGradeSummaries={loadPeriodGradeSummaries}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <PeriodGradeSummariesFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingPeriodGradeSummary={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        enrollmentOptions={enrollmentOptions}
        subjectOfferingOptions={subjectOfferingOptions}
        academicPeriodOptions={academicPeriodOptions}
        qualitativeScaleOptions={qualitativeScaleOptions}
        promotionStatusOptions={promotionStatusOptions}
      />

      <PeriodGradeSummaryViewModal
        isOpen={isViewOpen}
        periodGradeSummaryId={viewingItem?.id ?? null}
        onClose={closeViewModal}
      />

      <PeriodGradeSummaryDeleteModal
        isOpen={isDeleteOpen}
        entity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deletePeriodGradeSummary}
      />
    </div>
  );
}
