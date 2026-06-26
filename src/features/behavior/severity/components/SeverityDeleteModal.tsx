import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { useSoftDeleteFlow } from "@shared/hooks/useSoftDeleteFlow";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import type { SeverityDeleteParamsT, SeverityT } from "../severity.types";

interface SeverityDeleteModalProps {
  isOpen: boolean;
  severity: SeverityT | null;
  onClose: () => void;
  onSoftDelete: (params: SeverityDeleteParamsT) => Promise<SoftDeleteResponseT>;
}

export const SeverityDeleteModal: React.FC<SeverityDeleteModalProps> = ({
  isOpen,
  severity,
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
    id: severity?.id ?? null,
    softDelete: onSoftDelete,
  });

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !severity) return null;

  const isBusy = phase === "probing" || phase === "deactivating";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!isBusy ? handleClose : undefined}
      />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {phase === "done"
              ? "Desactivado"
              : phase === "error"
                ? "Error"
                : "Desactivar Severidad"}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5">
          {phase === "probing" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm text-slate-600">
                Verificando registros relacionados...
              </p>
            </div>
          )}
          {phase === "confirm" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <AlertTriangle className="size-6" />
              </span>
              <div className="space-y-2">
                <p className="text-sm text-slate-900 font-medium">
                  ¿Desactivar severidad{" "}
                  <span className="font-semibold">{severity.name}</span>?
                </p>
                {message && (
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {message}
                  </p>
                )}
                {affectedRecords !== null && affectedRecords > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    Registros afectados: {affectedRecords}
                  </p>
                )}
              </div>
            </div>
          )}
          {phase === "deactivating" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Loader2 className="size-10 animate-spin text-red-500" />
              <p className="text-sm text-slate-600">
                Desactivando registro y dependencias...
              </p>
            </div>
          )}
          {phase === "done" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-green-50 text-green-500">
                <CheckCircle2 className="size-6" />
              </span>
              <div>
                <p className="text-sm text-slate-900 font-medium">
                  Severidad{" "}
                  <span className="font-semibold">{severity.name}</span>{" "}
                  desactivada
                </p>
                {deactivatedRecords !== null && deactivatedRecords > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Se desactivaron {deactivatedRecords} registros relacionados
                  </p>
                )}
              </div>
            </div>
          )}
          {phase === "error" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <XCircle className="size-6" />
              </span>
              <div>
                <p className="text-sm text-slate-900 font-medium">
                  No se pudo desactivar
                </p>
                {errorMsg && (
                  <p className="text-xs text-slate-500 mt-1">{errorMsg}</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          {phase === "confirm" && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirm}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirmar
              </button>
            </>
          )}
          {(phase === "done" || phase === "error") && (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
