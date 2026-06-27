import {
  AlertTriangle,
  Calendar,
  FileText,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useEffect, useReducer } from "react";

import { DetailRow } from "@shared/components/DetailRow";
import { behaviorEvaluationService } from "../behavior-evaluation.service";

import type {
  BehaviorEvaluationT,
  RelatedConductIncidentT,
} from "../behavior-evaluation.types";

interface State {
  data: BehaviorEvaluationT | null;
  loading: boolean;
  error: string | null;
}
interface IncState {
  incidents: RelatedConductIncidentT[];
  loading: boolean;
}
type Action =
  | { type: "loading" }
  | { type: "success"; data: BehaviorEvaluationT }
  | { type: "error"; error: string };
type IncAction =
  | { type: "loading" }
  | { type: "success"; incidents: RelatedConductIncidentT[] }
  | { type: "error" };

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
function incReducer(_state: IncState, action: IncAction): IncState {
  switch (action.type) {
    case "loading":
      return { incidents: [], loading: true };
    case "success":
      return { incidents: action.incidents, loading: false };
    case "error":
      return { incidents: [], loading: false };
  }
}

interface BehaviorEvaluationViewModalProps {
  isOpen: boolean;
  evaluationId: number | null;
  onClose: () => void;
  onEdit: (evaluation: BehaviorEvaluationT) => void;
}

export const BehaviorEvaluationViewModal: React.FC<
  BehaviorEvaluationViewModalProps
> = ({ isOpen, evaluationId, onClose, onEdit }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });
  const [inc, incDispatch] = useReducer(incReducer, {
    incidents: [],
    loading: false,
  });

  useEffect(() => {
    if (isOpen && evaluationId !== null) {
      dispatch({ type: "loading" });
      behaviorEvaluationService
        .get({ id: evaluationId })
        .then((data) => {
          dispatch({ type: "success", data });
          incDispatch({ type: "loading" });
          behaviorEvaluationService
            .getRelatedIncidents({ id: evaluationId })
            .then((incidents) => incDispatch({ type: "success", incidents }))
            .catch(() => incDispatch({ type: "error" }));
        })
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, evaluationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Evaluación de Conducta
            </h3>
            <p className="text-xs text-slate-500">
              Detalle y escala de comportamiento
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
                  label="Período"
                  value={state.data.academic_period_name}
                />
                <DetailRow
                  icon={<FileText className="size-3.5" />}
                  label="Escala Calculada"
                  value={state.data.calculated_scale_name}
                />
                <DetailRow
                  icon={<FileText className="size-3.5" />}
                  label="Escala Final"
                  value={state.data.final_scale_name ?? "—"}
                />
                <DetailRow
                  icon={<Calendar className="size-3.5" />}
                  label="Fecha"
                  value={state.data.evaluation_date}
                />
                <DetailRow
                  icon={<UserCheck className="size-3.5" />}
                  label="Aprobación"
                  value={state.data.approval_date ?? "Pendiente"}
                />
              </div>
              {state.data.general_observation && (
                <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">
                    Observación:{" "}
                  </span>
                  {state.data.general_observation}
                </p>
              )}
              {state.data.override_reason && (
                <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  <span className="font-semibold">Anulación: </span>
                  {state.data.override_reason}
                </p>
              )}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Incidentes Relacionados ({inc.incidents.length})
                </h4>
                {inc.loading ? (
                  <div className="h-8 animate-pulse rounded bg-slate-100" />
                ) : inc.incidents.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Sin incidentes registrados
                  </p>
                ) : (
                  <div className="max-h-40 space-y-1 overflow-y-auto">
                    {inc.incidents.map((incItem) => (
                      <div
                        key={incItem.id}
                        className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5"
                      >
                        <AlertTriangle className="size-3.5 shrink-0 text-amber-500" />
                        <div className="min-w-0 flex-1 leading-tight">
                          <p className="truncate text-xs font-medium text-slate-900">
                            {incItem.incident_type_name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {incItem.severity_name} — {incItem.incident_date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cerrar
          </button>
          {state.data && (
            <button
              type="button"
              onClick={() => {
                onEdit(state.data!);
                onClose();
              }}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-primary-hover"
            >
              Anular Evaluación
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
