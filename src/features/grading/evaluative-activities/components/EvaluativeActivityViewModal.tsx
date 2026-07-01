import { BookOpen, Calendar, X } from "lucide-react";
import { useEffect, useReducer } from "react";

import { DetailRow } from "@shared/components/DetailRow";
import { evaluativeActivityService } from "../evaluative-activities.service";

import type { EvaluativeActivityT } from "../evaluative-activities.types";

interface State {
  data: EvaluativeActivityT | null;
  loading: boolean;
  error: string | null;
}
type Action =
  | { type: "loading" }
  | { type: "success"; data: EvaluativeActivityT }
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

interface EvaluativeActivityViewModalProps {
  isOpen: boolean;
  evaluativeActivityId: number | null;
  onClose: () => void;
}

export const EvaluativeActivityViewModal: React.FC<
  EvaluativeActivityViewModalProps
> = ({ isOpen, evaluativeActivityId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen && evaluativeActivityId !== null) {
      dispatch({ type: "loading" });
      evaluativeActivityService
        .get({ id: evaluativeActivityId })
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, evaluativeActivityId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Detalle de Actividad
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Información de la actividad evaluativa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-5 p-6">
          {state.loading && (
            <div className="flex animate-pulse flex-col gap-4 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="h-4 w-48 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {state.error && (
            <div className="flex items-center gap-2.5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              <X className="size-4 shrink-0" />
              {state.error}
            </div>
          )}
          {state.data && (
            <div className="space-y-5">
              <DetailRow
                icon={<BookOpen className="size-4" />}
                label="Título"
                value={state.data.title}
              />
              <DetailRow
                icon={<BookOpen className="size-4" />}
                label="Clase"
                value={state.data.teacher_subject_section_name}
              />
              <DetailRow
                icon={<BookOpen className="size-4" />}
                label="Bloque"
                value={state.data.block_component_name}
              />
              <DetailRow
                icon={<Calendar className="size-4" />}
                label="Vencimiento"
                value={state.data.due_date}
              />
              <DetailRow
                icon={<BookOpen className="size-4" />}
                label="Punt. Máx."
                value={state.data.max_score}
              />
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <span className="size-2 rounded-full bg-current" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estado
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${state.data.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${state.data.is_active ? "bg-emerald-500" : "bg-slate-400"}`}
                    />
                    {state.data.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
