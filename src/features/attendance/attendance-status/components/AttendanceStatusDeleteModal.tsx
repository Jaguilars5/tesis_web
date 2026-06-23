import { AlertTriangle, Loader2, X } from "lucide-react";
import { useState } from "react";
import type { AttendanceStatusT } from "../attendance-status.types";

interface Props { isOpen: boolean; attendanceStatus: AttendanceStatusT | null; onClose: () => void; onConfirm: (id: number) => Promise<void>; }

export const AttendanceStatusDeleteModal = ({ isOpen, attendanceStatus, onClose, onConfirm }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!isOpen || !attendanceStatus) return null;
  const handleConfirm = async () => { setIsDeleting(true); try { await onConfirm(attendanceStatus.id); onClose(); } finally { setIsDeleting(false); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="size-5 text-red-600" /></div><div><h3 className="text-lg font-semibold text-slate-900">Desactivar Estado</h3><p className="mt-0.5 text-sm text-slate-500">Esta acción desactivará el registro</p></div></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="size-5" /></button>
        </div>
        <div className="p-5"><p className="text-sm text-slate-600">¿Está seguro de desactivar el estado <span className="font-semibold text-slate-900">{attendanceStatus.name}</span>?</p></div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} disabled={isDeleting} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">Cancelar</button>
          <button type="button" onClick={handleConfirm} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isDeleting ? <><Loader2 className="size-4 animate-spin" /> Desactivando...</> : "Desactivar"}
          </button>
        </div>
      </div>
    </div>
  );
};
