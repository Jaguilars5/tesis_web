import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  selectAuthUser,
  selectUserPermissions,
} from "@features/auth/auth.slice";
import { UserRoleEnum } from "@features/auth";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useEvaluativeActivityController } from "./hooks/useEvaluativeActivityController";
import { useEvaluativeActivityForm } from "./hooks/useEvaluativeActivityForm";
import { useEvaluativeActivityOptions } from "./hooks/useEvaluativeActivityOptions";
import { EvaluativeActivityDeleteModal } from "./components/EvaluativeActivityDeleteModal";
import { EvaluativeActivityFormModal } from "./components/EvaluativeActivityFormModal";
import { EvaluativeActivityTable } from "./components/EvaluativeActivityTable";
import { EvaluativeActivityViewModal } from "./components/EvaluativeActivityViewModal";

import type { EvaluativeActivityT } from "./evaluative-activities.types";
import { EVALUATIVE_ACTIVITY_PERMISSIONS } from "./evaluative-activities.constants";

export default function EvaluativeActivitiesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const user = useAppSelector(selectAuthUser);
  const isTeacher = user?.role === UserRoleEnum.TEACHER;
  const canCreate = hasPermission(
    permissions,
    EVALUATIVE_ACTIVITY_PERMISSIONS.CREATE,
  );
  const canEdit = hasPermission(
    permissions,
    EVALUATIVE_ACTIVITY_PERMISSIONS.UPDATE,
  );
  const canDelete = hasPermission(
    permissions,
    EVALUATIVE_ACTIVITY_PERMISSIONS.DELETE,
  );

  const { items, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useEvaluativeActivityController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useEvaluativeActivityForm({ create: createItem, update: updateItem });

  const { teacherSubjectSectionOptions, activityTypeOptions } =
    useEvaluativeActivityOptions();

  // Un docente solo debe ver/calificar las actividades de sus propias clases.
  // Reforzamos en el cliente filtrando por las teacher-subject-sections del docente.
  const allowedTssIds = useMemo(
    () => new Set(teacherSubjectSectionOptions.map((o) => Number(o.value))),
    [teacherSubjectSectionOptions],
  );
  const visibleItems = useMemo(
    () =>
      isTeacher
        ? items.filter((a) => allowedTssIds.has(a.teacher_subject_section))
        : items,
    [isTeacher, items, allowedTssIds],
  );

  const [viewingItem, setViewingItem] = useState<EvaluativeActivityT | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<EvaluativeActivityT | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((a: EvaluativeActivityT) => {
    setViewingItem(a);
    setIsViewOpen(true);
  }, []);
  const closeViewModal = useCallback(() => {
    setViewingItem(null);
    setIsViewOpen(false);
  }, []);
  const openDeleteModal = useCallback((a: EvaluativeActivityT) => {
    setDeletingItem(a);
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
            Actividades Evaluativas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las actividades evaluativas
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nueva Actividad
          </button>
        )}
      </div>

      <EvaluativeActivityTable
        evaluativeActivities={visibleItems}
        isLoading={isLoading}
        loadEvaluativeActivities={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <EvaluativeActivityFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingEvaluativeActivity={editingItem}
        teacherSubjectSectionOptions={teacherSubjectSectionOptions}
        activityTypeOptions={activityTypeOptions}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <EvaluativeActivityViewModal
        isOpen={isViewOpen}
        evaluativeActivityId={viewingItem?.id ?? null}
        onClose={closeViewModal}
      />

      <EvaluativeActivityDeleteModal
        isOpen={isDeleteOpen}
        evaluativeActivity={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteItem}
      />
    </div>
  );
}
