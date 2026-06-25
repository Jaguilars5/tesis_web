import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { ACADEMIC_PERIOD_PERMISSIONS } from "./academic-period.constants";
import { useAcademicPeriodController } from "./hooks/useAcademicPeriodController";
import { useAcademicPeriodForm } from "./hooks/useAcademicPeriodForm";
import { usePeriodTypeOptions } from "./hooks/usePeriodTypeOptions";
import { useSchoolYearOptions } from "./hooks/useSchoolYearOptions";
import { AcademicPeriodDeleteModal } from "./components/AcademicPeriodDeleteModal";
import { AcademicPeriodFormModal } from "./components/AcademicPeriodFormModal";
import { AcademicPeriodTable } from "./components/AcademicPeriodTable";
import { AcademicPeriodViewModal } from "./components/AcademicPeriodViewModal";

import type {
  AcademicPeriodDeleteParamsT,
  AcademicPeriodT,
} from "./academic-period.types";

export default function AcademicPeriodsPage() {
  const { periodTypeOptions } = usePeriodTypeOptions();
  const { schoolYearOptions } = useSchoolYearOptions();

  const {
    academicPeriods,
    isLoading,
    loadAcademicPeriods,
    createAcademicPeriod,
    updateAcademicPeriod,
    deleteAcademicPeriod,
  } = useAcademicPeriodController();

  const {
    isOpen,
    isEdit,
    editingAcademicPeriod,
    submitErrors,
    openModal,
    closeModal,
    handleCreateMany,
    handleUpdate,
  } = useAcademicPeriodForm({
    create: createAcademicPeriod,
    update: updateAcademicPeriod,
  });

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, ACADEMIC_PERIOD_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, ACADEMIC_PERIOD_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, ACADEMIC_PERIOD_PERMISSIONS.DELETE);

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingPeriod, setDeletingPeriod] = useState<AcademicPeriodT | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((period: AcademicPeriodT) => {
    setViewingId(period.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((period: AcademicPeriodT) => {
    setDeletingPeriod(period);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingPeriod(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (params: AcademicPeriodDeleteParamsT) => {
      try {
        await deleteAcademicPeriod(params);
      } catch (error) {
        console.error(error);
      }
    },
    [deleteAcademicPeriod],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Periodos Academicos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los periodos de evaluacion del ano lectivo
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nuevo Periodo
          </button>
        )}
      </div>

      <AcademicPeriodTable
        academicPeriods={academicPeriods}
        isLoading={isLoading}
        loadAcademicPeriods={loadAcademicPeriods}
        schoolYearOptions={schoolYearOptions}
        periodTypeOptions={periodTypeOptions}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <AcademicPeriodFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAcademicPeriod={editingAcademicPeriod}
        periodTypeOptions={periodTypeOptions}
        schoolYearOptions={schoolYearOptions}
        submitErrors={submitErrors}
        onCreateMany={handleCreateMany}
        onUpdate={handleUpdate}
      />

      <AcademicPeriodViewModal
        isOpen={isViewOpen}
        periodId={viewingId}
        onClose={closeViewModal}
      />

      <AcademicPeriodDeleteModal
        isOpen={isDeleteOpen}
        period={deletingPeriod}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
