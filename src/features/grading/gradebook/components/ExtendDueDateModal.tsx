import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import type { GradingContextT } from "../gradebook.types";

interface ExtendDueDateModalProps {
  isOpen: boolean;
  gradingContext: GradingContextT;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (dueDate: string, reason: string) => Promise<void>;
}

export const ExtendDueDateModal: React.FC<ExtendDueDateModalProps> = ({
  isOpen,
  gradingContext,
  saving,
  error,
  onClose,
  onSubmit,
}) => {
  const [dueDate, setDueDate] = useState(gradingContext.dueDate);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDueDate(gradingContext.dueDate);
      setReason("");
    }
  }, [isOpen, gradingContext.dueDate]);

  if (!isOpen) return null;

  const minDate = gradingContext.periodStartDate;
  const maxDate = gradingContext.periodEndDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(dueDate, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-labelledby="extend-due-date-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2
            id="extend-due-date-title"
            className="text-lg font-bold text-slate-800"
          >
            Extender fecha de entrega
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <p className="text-sm text-slate-600">
            El cambio quedará registrado en el historial. La nueva fecha debe
            estar dentro del período «{gradingContext.periodName}» (
            {minDate} — {maxDate}).
          </p>

          <CustomInput
            label="Nueva fecha de entrega"
            name="due_date"
            type="date"
            value={dueDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClassname}
            required
          />

          <CustomInput
            label="Motivo del cambio"
            name="reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej. Extensión por feriado o recuperación"
            className={inputClassname}
            required
          />

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !dueDate || !reason.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Guardar nueva fecha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
