import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useAttendanceStatusController, useAttendanceStatusForm } from "./attendance-status.controller";
import { AttendanceStatusDeleteModal } from "./components/AttendanceStatusDeleteModal";
import { AttendanceStatusFormModal } from "./components/AttendanceStatusFormModal";
import { AttendanceStatusTable } from "./components/AttendanceStatusTable";
import { AttendanceStatusViewModal } from "./components/AttendanceStatusViewModal";
import type { AttendanceStatusT } from "./attendance-status.types";

export default function AttendanceStatusesPage() {
  const { attendanceStatuses, isLoading, loadAttendanceStatuses, createAttendanceStatus, updateAttendanceStatus, deleteAttendanceStatus } = useAttendanceStatusController();
  const { isOpen, isEdit, editingAttendanceStatus, submitErrors, openModal, closeModal, handleSubmit } = useAttendanceStatusForm({ create: createAttendanceStatus, update: updateAttendanceStatus });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<AttendanceStatusT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((s: AttendanceStatusT) => { setViewingId(s.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openDeleteModal = useCallback((s: AttendanceStatusT) => { setDeleting(s); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeleting(null); }, []);
  const handleDeleteConfirm = useCallback(async (id: number) => { await deleteAttendanceStatus(id); }, [deleteAttendanceStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Estados de Asistencia</h1><p className="mt-1 text-sm text-slate-500">Gestiona los estados de asistencia</p></div>
        <button type="button" onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><Plus className="size-4" />Nuevo Estado</button>
      </div>

      <AttendanceStatusTable attendanceStatuses={attendanceStatuses} isLoading={isLoading} loadAttendanceStatuses={loadAttendanceStatuses} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} />
      <AttendanceStatusFormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingAttendanceStatus={editingAttendanceStatus} onSubmit={handleSubmit} submitErrors={submitErrors} />
      <AttendanceStatusViewModal isOpen={isViewOpen} attendanceStatusId={viewingId} onClose={closeViewModal} />
      <AttendanceStatusDeleteModal isOpen={isDeleteOpen} attendanceStatus={deleting} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
