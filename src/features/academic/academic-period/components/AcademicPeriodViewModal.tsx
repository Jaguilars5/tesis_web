import { CalendarDays, FileText, Hash, Percent, X } from "lucide-react";
import { useEffect, useReducer } from "react";

import { academicPeriodService } from "../academic-period.service";

import type { AcademicPeriodT } from "../academic-period.types";

interface State {
  data: AcademicPeriodT | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "loading" }
  | { type: "success"; data: AcademicPeriodT }
  | { type: "error"; error: string };

const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.data, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.error };
  }
};

interface AcademicPeriodViewModalProps {
  isOpen: boolean;
  periodId: number | null;
  onClose: () => void;
}

export const AcademicPeriodViewModal = ({
  isOpen,
  periodId,
  onClose,
}: AcademicPeriodViewModalProps) => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen && periodId !== null) {
      dispatch({ type: "loading" });
      academicPeriodService
        .get(periodId)
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, periodId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Detalle de Periodo Academico
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Informacion del periodo academico
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {state.loading && (
            <div className="flex animate-pulse flex-col gap-4 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
                icon={<FileText className="size-4" />}
                label="Nombre"
                value={state.data.name}
              />
              <DetailRow
                icon={<Hash className="size-4" />}
                label="Código"
                value={state.data.code}
              />
              <DetailRow
                icon={<CalendarDays className="size-4" />}
                label="Año Escolar"
                value={state.data.school_year_name}
              />
              <DetailRow
                icon={<FileText className="size-4" />}
                label="Tipo de Periodo"
                value={state.data.period_type_name}
              />
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  icon={<CalendarDays className="size-4" />}
                  label="Fecha Inicio"
                  value={state.data.start_date}
                />
                <DetailRow
                  icon={<CalendarDays className="size-4" />}
                  label="Fecha Fin"
                  value={state.data.end_date}
                />
              </div>
              <DetailRow
                icon={<Percent className="size-4" />}
                label="Peso en el Año"
                value={
                  state.data.year_weight != null
                    ? `${state.data.year_weight}%`
                    : "Sin asignar"
                }
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
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${
                      state.data.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        state.data.is_active ? "bg-emerald-500" : "bg-slate-400"
                      }`}
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

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
};
