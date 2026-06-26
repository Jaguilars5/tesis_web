import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";

import { behaviorEvaluationSchema } from "../behavior-evaluation.utils";

import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { BehaviorEvaluationFormValues, BehaviorEvaluationT } from "../behavior-evaluation.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    final_scale: "Escala Final",
    override_reason: "Razón de anulación",
    general_observation: "Observación",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface BehaviorEvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvaluation: BehaviorEvaluationT | null;
  onSubmit: (values: BehaviorEvaluationFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const BehaviorEvaluationFormModal: React.FC<BehaviorEvaluationFormModalProps> = ({
  isOpen,
  onClose,
  editingEvaluation,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): BehaviorEvaluationFormValues => {
    if (editingEvaluation) {
      return {
        final_scale: editingEvaluation.final_scale,
        override_reason: editingEvaluation.override_reason,
        general_observation: editingEvaluation.general_observation,
      };
    }
    return { final_scale: null, override_reason: "", general_observation: "" };
  };

  const formik = useFormik<BehaviorEvaluationFormValues>({
    initialValues: getInitialValues(),
    validationSchema: behaviorEvaluationSchema,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Anular Evaluación</h3>
            <p className="mt-0.5 text-sm text-slate-500">Asignar escala final y justificación</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />
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
