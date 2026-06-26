import { BookOpen, Calendar, FileText, User, X } from "lucide-react";
import { useEffect, useReducer } from "react";
import { format as fechaFormat } from "fecha";

import { DetailRow } from "@shared/components/DetailRow";
import { attendanceService } from "../attendance.service";

import type { AttendanceT } from "../attendance.types";

interface State { data: AttendanceT | null; loading: boolean; error: string | null; }
type Action = { type: "loading" } | { type: "success"; data: AttendanceT } | { type: "error"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { data: null, loading: true, error: null };
    case "success": return { data: action.data, loading: false, error: null };
    case "error": return { data: null, loading: false, error: action.error };
  }
}

interface AttendanceViewModalProps { isOpen: boolean; attendanceId: number | null; onClose: () => void; }

export const AttendanceViewModal: React.FC<AttendanceViewModalProps> = ({ isOpen, attendanceId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: false, error: null });

  useEffect(() => {
    if (isOpen && attendanceId !== null) {
      dispatch({ type: "loading" });
      attendanceService.get({ id: attendanceId })
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, attendanceId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Detalle de Asistencia</h3>
            <p className="mt-0.5 text-sm text-slate-500">Información del registro de asistencia</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        <div className="space-y-5 p-6">
          {state.loading && (
            <div className="flex animate-pulse flex-col gap-4 py-4">
              {[1, 2, 3, 4].map((i) => (<div key={i} className="flex items-start gap-3"><div className="size-9 rounded-lg bg-slate-100" /><div className="flex-1 space-y-2"><div className="h-3 w-20 rounded bg-slate-100" /><div className="h-4 w-48 rounded bg-slate-100" /></div></div>))}
            </div>
          )}

          {state.error && <div className="flex items-center gap-2.5 rounded-lg bg-red-50 p-4 text-sm text-red-600"><X className="size-4 shrink-0" />{state.error}</div>}

          {state.data && (
            <div className="space-y-5">
              <DetailRow icon={<User className="size-4" />} label="Estudiante" value={state.data.enrollment_name} />
              <DetailRow icon={<BookOpen className="size-4" />} label="Clase" value={state.data.teacher_subject_section_name} />
              <DetailRow icon={<Calendar className="size-4" />} label="Fecha" value={fechaFormat(new Date(state.data.attendance_date), "DD/MM/YYYY") || state.data.attendance_date} />
              <DetailRow icon={<FileText className="size-4" />} label="Estado" value={state.data.attendance_status_name} />
              <DetailRow icon={<FileText className="size-4" />} label="Tipo de Ausencia" value={state.data.absence_type ? state.data.attendance_status_name : "—"} />
              <DetailRow icon={<FileText className="size-4" />} label="Período" value={state.data.academic_period_name} />
              {state.data.observation && <DetailRow icon={<FileText className="size-4" />} label="Observaciones" value={state.data.observation} />}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
