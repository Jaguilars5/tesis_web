import { AlertTriangle, Loader2, X } from "lucide-react";
import { useState } from "react";

import type { AcademicPeriodT } from "../academic-period.types";

interface AcademicPeriodDeleteModalProps {
  isOpen: boolean;
  period: AcademicPeriodT | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const AcademicPeriodDeleteModal = ({
  isOpen,
  period,
  onClose,
  onConfirm,
}: AcademicPeriodDeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!period) return;
    setIsDeleting(true);
    try {
      await onConfirm(period.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !period) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Desactivar Periodo Academico
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="size-6" />
            </span>
            <div>
              <p className="text-sm text-slate-600">
                ¿Está seguro de desactivar el siguiente periodo?
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {period.name}
              </p>
              <p className="text-xs text-slate-500">
                {period.school_year_name} &middot; {period.period_type_name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Desactivando...
              </>
            ) : (
              "Desactivar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
