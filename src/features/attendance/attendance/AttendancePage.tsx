import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useAttendanceController,
  useAttendanceForm,
} from "./attendance.controller";
import { AttendanceFormModal } from "./components/AttendanceFormModal";
import { AttendanceTable } from "./components/AttendanceTable";
import { AttendanceViewModal } from "./components/AttendanceViewModal";

import type { AttendanceT } from "./attendance.types";

export default function AttendancesPage() {
  const {
    attendances,
    isLoading,
    loadAttendances,
    createAttendance,
    updateAttendance,
  } = useAttendanceController();

  const {
    isOpen,
    isEdit,
    editingAttendance,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useAttendanceForm({ create: createAttendance, update: updateAttendance });

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
          <h1 className="text-2xl font-extrabold text-slate-800">
            Asistencias
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los registros de asistencia de los estudiantes
          </p>
        </div>
        {/* <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nueva Asistencia
        </button> */}
      </div>

      <AttendanceTable
        attendances={attendances}
        isLoading={isLoading}
        loadAttendances={loadAttendances}
        onEdit={openModal}
        onView={openViewModal}
      />

      <AttendanceFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingAttendance={editingAttendance}
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
