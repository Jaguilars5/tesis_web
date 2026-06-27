import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";

import { useAttendanceController } from "./hooks/useAttendanceController";
import { useAttendanceForm } from "./hooks/useAttendanceForm";
import { AttendanceFormModal } from "./components/AttendanceFormModal";
import { AttendanceTable } from "./components/AttendanceTable";
import { AttendanceViewModal } from "./components/AttendanceViewModal";

import type { AttendanceT } from "./attendance.types";
import { ATTENDANCE_PERMISSIONS } from "./attendance.constants";

export default function AttendancesPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, ATTENDANCE_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, ATTENDANCE_PERMISSIONS.UPDATE);

  const { items, totalCount, isLoading, loadItems, createItem, updateItem } =
    useAttendanceController();

  const {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAttendanceForm({ create: createItem, update: updateItem });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const openViewModal = useCallback((attendance: AttendanceT) => {
    setViewingId(attendance.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Asistencias</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los registros de asistencia de los estudiantes
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Nueva Asistencia
          </button>
        )}
      </div>

      <AttendanceTable
        attendances={items}
        totalCount={totalCount}
        isLoading={isLoading}
        loadAttendances={loadItems}
        onEdit={openModal}
        onView={openViewModal}
        canEdit={canEdit}
      />

      <AttendanceFormModal
        key={editingItem?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAttendance={editingItem}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <AttendanceViewModal
        isOpen={isViewOpen}
        attendanceId={viewingId}
        onClose={closeViewModal}
      />
    </div>
  );
}
