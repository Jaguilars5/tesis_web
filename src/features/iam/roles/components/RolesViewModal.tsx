import { FileText, X } from "lucide-react";
import { useEffect, useReducer } from "react";

import { roleService } from "../roles.service";

import type { RoleT } from "../roles.types";

interface State {
  data: RoleT | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "loading" }
  | { type: "success"; data: RoleT }
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

interface RolesViewModalProps {
  isOpen: boolean;
  entityId: number | null;
  onClose: () => void;
}

export const RolesViewModal = ({
  isOpen,
  entityId,
  onClose,
}: RolesViewModalProps) => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen && entityId !== null) {
      dispatch({ type: "loading" });
      roleService
        .get(entityId)
        .then((data) => dispatch({ type: "success", data }))
        .catch((err: Error) => dispatch({ type: "error", error: err.message }));
    }
  }, [isOpen, entityId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Detalle de Rol
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Información del rol
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
                icon={<FileText className="size-4" />}
                label="Nombre"
                value={state.data.name}
              />
              <DetailRow
                icon={<FileText className="size-4" />}
                label="Descripción"
                value={state.data.description}
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

              {state.data.role_permissions && state.data.role_permissions.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Permisos Asignados
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {state.data.role_permissions.map((rp) => (
                      <span
                        key={rp.id}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        {rp.permission.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
