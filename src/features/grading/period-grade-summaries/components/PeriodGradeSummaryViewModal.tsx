import { BookOpen, User, Percent, Calendar, X } from "lucide-react";
import { useEffect, useReducer } from "react";
import { DetailRow } from "@shared/components/DetailRow";
import { periodGradeSummaryService } from "../period-grade-summaries.service";
import type { PeriodGradeSummaryT } from "../period-grade-summaries.types";

interface State {
  data: PeriodGradeSummaryT | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "loading" }
  | { type: "success"; data: PeriodGradeSummaryT }
  | { type: "error"; error: string };

function viewReducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.data, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.error };
  }
}

interface Props {
  isOpen: boolean;
  periodGradeSummaryId: number | null;
  onClose: () => void;
}

export const PeriodGradeSummaryViewModal: React.FC<Props> = ({
  isOpen,
  periodGradeSummaryId,
  onClose,
}) => {
  const [state, dispatch] = useReducer(viewReducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen && periodGradeSummaryId !== null) {
      dispatch({ type: "loading" });
      periodGradeSummaryService
        .get({ id: periodGradeSummaryId })
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) =>
          dispatch({ type: "error", error: err.message }),
        );
    }
  }, [isOpen, periodGradeSummaryId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Detalle de Resumen
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Información del resumen de calificaciones
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
                icon={<User className="size-4" />}
                label="Estudiante"
                value={state.data.enrollment_name}
              />
              <DetailRow
                icon={<BookOpen className="size-4" />}
                label="Oferta"
                value={state.data.subject_offering_name}
              />
              <DetailRow
                icon={<BookOpen className="size-4" />}
                label="Período"
                value={state.data.academic_period_name}
              />
              <DetailRow
                icon={<Percent className="size-4" />}
                label="Promedio Final"
                value={String(state.data.final_avg_truncated)}
              />
              <DetailRow
                icon={<Percent className="size-4" />}
                label="Prom. Formativo"
                value={String(state.data.formative_avg)}
              />
              <DetailRow
                icon={<Percent className="size-4" />}
                label="Prom. Sumativo"
                value={String(state.data.summative_avg)}
              />
              {state.data.qualitative_scale && (
                <DetailRow
                  icon={<BookOpen className="size-4" />}
                  label="Escala Cualitativa"
                  value={state.data.qualitative_scale_name}
                />
              )}
              <DetailRow
                icon={<Calendar className="size-4" />}
                label="Calculado el"
                value={new Date(state.data.calculated_at).toLocaleDateString(
                  "es-EC",
                  {
                    dateStyle: "long",
                  },
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
