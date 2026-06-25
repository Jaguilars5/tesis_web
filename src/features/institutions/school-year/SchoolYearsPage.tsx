import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useSchoolYearController } from "./hooks/useSchoolYearController";
import { useSchoolYearForm } from "./hooks/useSchoolYearForm";
import { SchoolYearDeleteModal } from "./components/SchoolYearDeleteModal";
import { SchoolYearFormModal } from "./components/SchoolYearFormModal";
import { SchoolYearTable } from "./components/SchoolYearTable";
import { SchoolYearViewModal } from "./components/SchoolYearViewModal";
import { SCHOOL_YEAR_PERMISSIONS } from "./school-year.constants";
import type { SchoolYearDeleteParamsT, SchoolYearT } from "./school-year.types";

export default function SchoolYearsPage() {
  const {
    schoolYears,
    isLoading,
    loadSchoolYears,
    createSchoolYear,
    updateSchoolYear,
    deleteSchoolYear,
  } = useSchoolYearController();
  const {
    isOpen,
    isEdit,
    editingSchoolYear,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useSchoolYearForm({ create: createSchoolYear, update: updateSchoolYear });

  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, SCHOOL_YEAR_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, SCHOOL_YEAR_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, SCHOOL_YEAR_PERMISSIONS.DELETE);

  const [viewing, setViewing] = useState<SchoolYearT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<SchoolYearT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: SchoolYearT) => {
    setViewing(s);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewing(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((s: SchoolYearT) => {
    setDeleting(s);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleting(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (params: SchoolYearDeleteParamsT) => {
      try {
        await deleteSchoolYear(params);
      } catch (error) {
        console.error(error);
      }
    },
    [deleteSchoolYear],
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Años Escolares
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los años escolares
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nuevo Año
          </button>
        )}
      </div>
      <SchoolYearTable
        schoolYears={schoolYears}
        isLoading={isLoading}
        loadSchoolYears={loadSchoolYears}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />
      <SchoolYearFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingSchoolYear={editingSchoolYear}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />
      <SchoolYearViewModal
        isOpen={isViewOpen}
        schoolYearId={viewing?.id ?? null}
        onClose={closeViewModal}
      />
      <SchoolYearDeleteModal
        isOpen={isDeleteOpen}
        schoolYear={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
