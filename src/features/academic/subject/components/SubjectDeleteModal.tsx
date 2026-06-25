import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

import { useSoftDeleteFlow } from "@shared/hooks/useSoftDeleteFlow";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import type { SoftDeleteParamsT } from "@shared/types/soft-delete.types";

import type { SubjectT } from "../subject.types";

interface SubjectDeleteModalProps {
  isOpen: boolean;
  entity: SubjectT | null;
  onClose: () => void;
  onSoftDelete: (params: SoftDeleteParamsT) => Promise<SoftDeleteResponseT>;
}

export const SubjectDeleteModal: React.FC<SubjectDeleteModalProps> = ({ isOpen, entity, onClose, onSoftDelete }) => {
  const { phase, message, affectedRecords, deactivatedRecords, errorMsg, confirm } =
    useSoftDeleteFlow({ isOpen, id: entity?.id ?? null, softDelete: onSoftDelete });

  if (!isOpen || !entity) return null;

  const isBusy = phase === "probing" || phase === "deactivating";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Desactivar Materia</h3>
          <button type="button" onClick={onClose} disabled={isBusy} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5">
          {phase === "probing" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-slate-600">Verificando registros relacionados...</p>
            </div>
          )}
          {phase === "confirm" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <AlertTriangle className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{message ?? "¿Está seguro de desactivar?"}</p>
                <p className="mt-2 text-sm text-slate-600">{entity.name || entity.code || `ID ${entity.id}`}</p>
                {affectedRecords !== null && affectedRecords > 0 && (
                  <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                    Se desactivarán {affectedRecords} registro{affectedRecords === 1 ? "" : "s"} relacionado{affectedRecords === 1 ? "" : "s"}.
                  </p>
                )}
              </div>
            </div>
          )}
          {phase === "deactivating" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <Loader2 className="size-8 animate-spin text-red-500" />
              <p className="text-sm text-slate-600">Desactivando...</p>
            </div>
          )}
          {phase === "done" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle2 className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">Desactivado exitosamente</p>
                {deactivatedRecords !== null && deactivatedRecords > 0 && (
                  <p className="mt-1 text-sm text-slate-600">{deactivatedRecords} registro{deactivatedRecords === 1 ? "" : "s"} desactivado{deactivatedRecords === 1 ? "" : "s"}.</p>
                )}
              </div>
            </div>
          )}
          {phase === "error" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <X className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-red-700">{errorMsg ?? "Error al desactivar"}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          {phase === "confirm" && (
            <>
              <button type="button" onClick={onClose} disabled={isBusy} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">Cancelar</button>
              <button type="button" onClick={confirm} disabled={isBusy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isBusy ? <><Loader2 className="size-4 animate-spin" /> Desactivando...</> : "Confirmar"}
              </button>
            </>
          )}
          {(phase === "done" || phase === "error") && (
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover">Cerrar</button>
          )}
          {phase === "probing" && (
            <button type="button" onClick={onClose} disabled={isBusy} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">Cancelar</button>
          )}
        </div>
      </div>
    </div>
  );
};
