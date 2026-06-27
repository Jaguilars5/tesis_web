import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useAttendanceStatusController } from "./hooks/useAttendanceStatusController";
import { useAttendanceStatusForm } from "./hooks/useAttendanceStatusForm";
import { AttendanceStatusDeleteModal } from "./components/AttendanceStatusDeleteModal";
import { AttendanceStatusFormModal } from "./components/AttendanceStatusFormModal";
import { AttendanceStatusTable } from "./components/AttendanceStatusTable";
import { AttendanceStatusViewModal } from "./components/AttendanceStatusViewModal";

import type { AttendanceStatusT } from "./attendance-status.types";
import { ATTENDANCE_STATUS_PERMISSIONS } from "./attendance-status.constants";

export default function AttendanceStatusesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, ATTENDANCE_STATUS_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, ATTENDANCE_STATUS_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, ATTENDANCE_STATUS_PERMISSIONS.DELETE);

  const { items, totalCount, isLoading, loadItems, createItem, updateItem, deleteItem } =
    useAttendanceStatusController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAttendanceStatusForm({ create: createItem, update: updateItem });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<AttendanceStatusT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: AttendanceStatusT) => { setViewingId(s.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openDeleteModal = useCallback((s: AttendanceStatusT) => { setDeletingItem(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeletingItem(null); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Estados de Asistencia</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona los estados de asistencia</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
            <Plus className="size-4" />Nuevo Estado
          </button>
        )}
      </div>

      <AttendanceStatusTable
        attendanceStatuses={items}
        totalCount={totalCount}
        isLoading={isLoading}
        loadAttendanceStatuses={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <AttendanceStatusFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAttendanceStatus={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <AttendanceStatusViewModal
        isOpen={isViewOpen}
        attendanceStatusId={viewingId}
        onClose={closeViewModal}
      />

      <AttendanceStatusDeleteModal
        isOpen={isDeleteOpen}
        attendanceStatus={deletingItem}
        onClose={closeDeleteModal}
        onSoftDelete={deleteItem}
      />
    </div>
  );
}
