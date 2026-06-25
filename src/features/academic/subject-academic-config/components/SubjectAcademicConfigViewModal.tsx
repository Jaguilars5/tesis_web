import { BookOpen, Clock, GraduationCap, X } from "lucide-react";
import { useEffect, useReducer } from "react";

import { DetailRow } from "@shared/components/DetailRow";

import { subjectAcademicConfigService } from "../subject-academic-config.service";

import type { SubjectAcademicConfigT } from "../subject-academic-config.types";

interface SubjectAcademicConfigViewModalState {
  data: SubjectAcademicConfigT | null;
  loading: boolean;
  error: string | null;
}

type SubjectAcademicConfigViewModalAction =
  | { type: "loading" }
  | { type: "success"; data: SubjectAcademicConfigT }
  | { type: "error"; error: string };

const reducer = (
  state: SubjectAcademicConfigViewModalState,
  action: SubjectAcademicConfigViewModalAction,
): SubjectAcademicConfigViewModalState => {
  switch (action.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.data, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.error };
    default:
      return state;
  }
};

interface SubjectAcademicConfigViewModalProps {
  isOpen: boolean;
  configId: number | null;
  onClose: () => void;
}

export const SubjectAcademicConfigViewModal: React.FC<
  SubjectAcademicConfigViewModalProps
> = ({ isOpen, configId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen && configId !== null) {
      dispatch({ type: "loading" });
      subjectAcademicConfigService
        .get({ id: configId })
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, configId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Detalle de Configuracion
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Informacion de la materia por grado academico
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
              {[1, 2, 3, 4].map((i) => (
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
                label="Materia"
                value={state.data.subject_name}
              />
              <DetailRow
                icon={<GraduationCap className="size-4" />}
                label="Grado Academico"
                value={state.data.academic_grade_name}
              />
              <DetailRow
                icon={<Clock className="size-4" />}
                label="Horas Semanales"
                value={`${state.data.weekly_hours} horas`}
              />
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <BookOpen className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Obligatorio
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${
                      state.data.is_required
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        state.data.is_required
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {state.data.is_required ? "Si" : "No"}
                  </span>
                </div>
              </div>
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
