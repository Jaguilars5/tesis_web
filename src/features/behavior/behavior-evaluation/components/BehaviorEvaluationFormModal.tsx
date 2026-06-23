import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { behaviorEvaluationSchema } from "../behavior-evaluation.utils";
import type { SubmitErrorState } from "../behavior-evaluation.controller";
import type { BehaviorEvaluationFormValues, BehaviorEvaluationT } from "../behavior-evaluation.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = { final_scale: "Escala Final", override_reason: "Razón de anulación", general_observation: "Observación", non_field_errors: "Error general" };
  return labels[field] || field;
};

interface Props { isOpen: boolean; onClose: () => void; editingEvaluation: BehaviorEvaluationT | null; onSubmit: (values: BehaviorEvaluationFormValues) => Promise<void>; submitErrors: SubmitErrorState; }

export const BehaviorEvaluationFormModal = ({ isOpen, onClose, editingEvaluation, onSubmit, submitErrors }: Props) => {
  const getInitialValues = (): BehaviorEvaluationFormValues => {
    if (editingEvaluation) return { final_scale: editingEvaluation.final_scale, override_reason: editingEvaluation.override_reason, general_observation: editingEvaluation.general_observation };
    return { final_scale: null, override_reason: "", general_observation: "" };
  };
  const formik = useFormik<BehaviorEvaluationFormValues>({ initialValues: getInitialValues(), validationSchema: behaviorEvaluationSchema, enableReinitialize: true, onSubmit });
  useEffect(() => { if (isOpen && editingEvaluation) formik.setValues(getInitialValues()); }, [isOpen, editingEvaluation]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div><h3 className="text-lg font-semibold text-slate-900">Anular Evaluación</h3><p className="mt-0.5 text-sm text-slate-500">Asignar escala final y justificación</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <div className="mx-5 mt-3 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 size-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <div className="flex-1"><p className="mb-2 text-sm font-semibold text-red-800">Error al guardar</p>{submitErrors.general.length > 0 && (<ul className="mb-2 space-y-1">{submitErrors.general.map((err, i) => (<li key={i} className="text-sm text-red-700">• {err}</li>))}</ul>)}{Object.keys(submitErrors.validation).length > 0 && (<ul className="space-y-1">{Object.entries(submitErrors.validation).map(([f, m]) => (<li key={f} className="text-sm text-red-700"><span className="font-semibold">{getFieldLabel(f)}:</span> {m}</li>))}</ul>)}</div>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput label="Razón de Anulación" name="override_reason" placeholder="Describa el motivo..." value={formik.values.override_reason} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.override_reason ? formik.errors.override_reason : undefined} className={inputClassname} />
          <CustomInput label="Observación General" name="general_observation" placeholder="Observación adicional (opcional)" value={formik.values.general_observation} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.general_observation ? formik.errors.general_observation : undefined} className={inputClassname} />
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={formik.isSubmitting} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              {formik.isSubmitting ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</> : "Anular"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
