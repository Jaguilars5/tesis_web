import { useFormik } from "formik";
import { useState } from "react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import { markAttendedSchema } from "../early-alerts.utils";

import type { EarlyAlertT } from "../early-alerts.types";

interface EarlyAlertMarkAttendedModalProps {
  isOpen: boolean;
  entity: EarlyAlertT | null;
  onClose: () => void;
  onMarkAttended: (id: number, response_actions: string) => Promise<EarlyAlertT>;
}

interface MarkAttendedFormValues { response_actions: string; }

export const EarlyAlertMarkAttendedModal = ({ isOpen, entity, onClose, onMarkAttended }: EarlyAlertMarkAttendedModalProps) => {
  const [generalError, setGeneralError] = useState<string | null>(null);

  const formik = useFormik<MarkAttendedFormValues>({
    initialValues: { response_actions: "" },
    enableReinitialize: true,
    validationSchema: markAttendedSchema,
    onSubmit: async (values) => {
      if (!entity) return;
      setGeneralError(null);
      try {
        await onMarkAttended(entity.id, values.response_actions);
        onClose();
      } catch (err) {
        setGeneralError(err instanceof Error ? err.message : "Error al marcar como atendida");
      }
    },
  });

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-sm animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Marcar como Atendida</h3>
            <p className="mt-0.5 text-sm text-slate-500">Alerta: {entity.enrollment_name}</p>
          </div>
          <button type="button" onClick={onClose} disabled={formik.isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {generalError && <div className="mx-5 mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{generalError}</div>}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput label="Acciones de Respuesta" name="response_actions" value={formik.values.response_actions}
            onBlur={formik.handleBlur} onChange={formik.handleChange} type="text"
            error={formik.touched.response_actions ? formik.errors.response_actions : undefined}
            className={inputClassname} disabled={formik.isSubmitting} />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
              Cancelar
            </button>
            <button type="submit" disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {formik.isSubmitting ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</> : "Marcar como Atendida"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
