import { AlertTriangle, Calendar, FileText, User, X } from "lucide-react";
import { useEffect, useReducer } from "react";

import { DetailRow } from "@shared/components/DetailRow";
import { conductIncidentService } from "../conduct-incident.service";

import type { ConductIncidentT } from "../conduct-incident.types";

interface State {
  data: ConductIncidentT | null;
  loading: boolean;
  error: string | null;
}
type Action =
  | { type: "loading" }
  | { type: "success"; data: ConductIncidentT }
  | { type: "error"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.data, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.error };
  }
}

interface ConductIncidentViewModalProps {
  isOpen: boolean;
  incidentId: number | null;
  onClose: () => void;
}

export const ConductIncidentViewModal: React.FC<
  ConductIncidentViewModalProps
> = ({ isOpen, incidentId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen && incidentId !== null) {
      dispatch({ type: "loading" });
      conductIncidentService
        .get({ id: incidentId })
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, incidentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Incidente de Conducta
            </h3>
            <p className="text-xs text-slate-500">
              Detalle del incidente reportado
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {state.loading && (
            <div className="flex animate-pulse flex-col gap-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="size-7 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 w-16 rounded bg-slate-100" />
                    <div className="h-3.5 w-40 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <X className="size-4 shrink-0" />
              {state.error}
            </div>
          )}
          {state.data && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <DetailRow
                  icon={<User className="size-3.5" />}
                  label="Estudiante"
                  value={state.data.enrollment_name}
                />
                <DetailRow
                  icon={<FileText className="size-3.5" />}
                  label="Tipo"
                  value={state.data.incident_type_name}
                />
                <DetailRow
                  icon={<AlertTriangle className="size-3.5" />}
                  label="Severidad"
                  value={state.data.severity_name}
                />
                <DetailRow
                  icon={<Calendar className="size-3.5" />}
                  label="Fecha"
                  value={state.data.incident_date}
                />
                <DetailRow
                  icon={<FileText className="size-3.5" />}
                  label="Período"
                  value={state.data.academic_period_name}
                />
                <DetailRow
                  icon={<FileText className="size-3.5" />}
                  label="Familia Notificada"
                  value={state.data.family_notified ? "Sí" : "No"}
                />
              </div>
              {state.data.description && (
                <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">
                    Descripción:{" "}
                  </span>
                  {state.data.description}
                </p>
              )}
              {state.data.actions_taken && (
                <p className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  <span className="font-semibold">Acciones tomadas: </span>
                  {state.data.actions_taken}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
