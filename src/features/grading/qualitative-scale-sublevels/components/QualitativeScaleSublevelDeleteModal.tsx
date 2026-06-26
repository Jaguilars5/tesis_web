import { AlertTriangle, Loader2, X } from "lucide-react";
import { useSoftDeleteFlow } from "@shared/hooks/useSoftDeleteFlow";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import type { QualitativeScaleSublevelDeleteParamsT } from "../qualitative-scale-sublevels.types";
import type { QualitativeScaleSublevelT } from "../qualitative-scale-sublevels.types";

interface Props {
  isOpen: boolean;
  entity: QualitativeScaleSublevelT | null;
  onClose: () => void;
  onSoftDelete: (
    params: QualitativeScaleSublevelDeleteParamsT,
  ) => Promise<SoftDeleteResponseT>;
}

export const QualitativeScaleSublevelDeleteModal: React.FC<Props> = ({
  isOpen,
  entity,
  onClose,
  onSoftDelete,
}) => {
  const {
    phase,
    message,
    affectedRecords,
    deactivatedRecords,
    errorMsg,
    confirm,
  } = useSoftDeleteFlow({
    isOpen,
    id: entity?.id ?? null,
    softDelete: onSoftDelete,
  });

  if (!isOpen || !entity) return null;

  const isBusy = phase === "probing" || phase === "deactivating";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Desactivar Asignación
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          {phase === "probing" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <Loader2 className="size-8 animate-spin text-slate-400" />
              <p className="text-sm text-slate-500">Verificando registros relacionados...</p>
            </div>
          )}

          {phase === "confirm" && (
            <>
              <div className="flex flex-col items-center gap-4 py-2 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle className="size-6" />
                </span>
                <div>
                  <p className="text-sm text-slate-600">
                    ¿Desactivar asignación de{" "}
                    <span className="font-semibold text-slate-900">
                      {entity.scale_name}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-slate-900">
                      {entity.sublevel_name}
                    </span>
                    ?
                  </p>
                </div>
              </div>
              {message && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                  <p className="font-medium">{message}</p>
                  {affectedRecords !== null && (
                    <p className="mt-1 text-xs">
                      Registros afectados: <strong>{affectedRecords}</strong>
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {phase === "deactivating" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <Loader2 className="size-8 animate-spin text-red-400" />
              <p className="text-sm text-slate-500">Desactivando asignación...</p>
            </div>
          )}

          {phase === "done" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-green-50 text-green-500">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Asignación desactivada exitosamente
                </p>
                {deactivatedRecords !== null && deactivatedRecords > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    {deactivatedRecords} registro(s) desactivado(s) en cascada
                  </p>
                )}
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle className="size-6" />
              </span>
              <p className="text-sm text-red-600">
                {errorMsg ?? "Error al desactivar la asignación"}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          {phase === "confirm" && (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {isBusy && <Loader2 className="size-4 animate-spin" />}
                Confirmar Desactivación
              </button>
            </>
          )}
          {(phase === "done" || phase === "error") && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
