import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { AcademicGradeT } from "../academic-grade.types";
export const AcademicGradeDeleteModal = ({
  isOpen,
  academicGrade,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  academicGrade: AcademicGradeT | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}) => {
  const [d, setD] = useState(false);
  if (!isOpen || !academicGrade) return null;
  const h = async () => {
    setD(true);
    try {
      await onConfirm(academicGrade.id);
      onClose();
    } finally {
      setD(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Desactivar Grado
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={d}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="size-6" />
            </span>
            <div>
              <p className="text-sm text-slate-600">
                ¿Desactivar{" "}
                <span className="font-semibold text-slate-900">
                  {academicGrade.name}
                </span>
                ?
              </p>
              {academicGrade.code && (
                <p className="text-xs text-slate-500">{academicGrade.code}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={d}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={h}
            disabled={d}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {d ? (
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
