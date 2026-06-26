import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { earlyAlertSchema } from "../early-alerts.utils";

import type { AlertTypeT, EarlyAlertFormValues, EarlyAlertT, UrgencyLevelT } from "../early-alerts.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    enrollment: "Matrícula",
    academic_period: "Período Académico",
    alert_type: "Tipo de Alerta",
    description: "Descripción",
    urgency_level: "Nivel de Urgencia",
    response_actions: "Acciones de Respuesta",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface EarlyAlertFormModalProps {
  isOpen: boolean; onClose: () => void; isEdit: boolean; editing: EarlyAlertT | null;
  onSubmit: (values: EarlyAlertFormValues) => Promise<void>; submitErrors: SubmitErrorState;
}

const initialValues: EarlyAlertFormValues = {
  enrollment: 0, academic_period: 0, alert_type: "", description: "", urgency_level: "", response_actions: "",
};

const buildEditInitialValues = (item: EarlyAlertT | null): EarlyAlertFormValues => {
  if (!item) return { ...initialValues };
  return {
    enrollment: item.enrollment,
    academic_period: item.academic_period,
    alert_type: item.alert_type ?? "",
    description: item.description,
    urgency_level: item.urgency_level ?? "",
    response_actions: item.response_actions,
  };
};

const ALERT_TYPE_OPTIONS: { label: string; value: AlertTypeT }[] = [
  { label: "Baja Asistencia", value: "low_attendance" },
  { label: "Calificaciones Bajas", value: "failing_grades" },
  { label: "Comportamiento", value: "behavioral" },
  { label: "Riesgo de Deserción", value: "dropout_risk" },
  { label: "Socioemocional", value: "socioemotional" },
];

const URGENCY_OPTIONS: { label: string; value: UrgencyLevelT }[] = [
  { label: "Baja", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Crítica", value: "critical" },
];

export const EarlyAlertFormModal: React.FC<EarlyAlertFormModalProps> = ({
  isOpen, onClose, isEdit, editing, onSubmit, submitErrors,
}) => {
  const formik = useFormik<EarlyAlertFormValues>({
    initialValues: buildEditInitialValues(editing),
    validationSchema: earlyAlertSchema,
    onSubmit: async (values) => { await onSubmit(values); },
  });

  if (!isOpen) return null;

  const hasSubmitErrors =
    submitErrors.general.length > 0 ||
    Object.keys(submitErrors.validation).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={isEdit ? undefined : onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{isEdit ? "Editar Alerta" : "Nueva Alerta Temprana"}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{isEdit ? "Modifique los datos de la alerta" : "Ingrese los datos de la alerta"}</p>
          </div>
          <button type="button" onClick={onClose} disabled={formik.isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="size-5" />
          </button>
        </div>

        {hasSubmitErrors && (
          <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput label="ID Matrícula" name="enrollment" value={String(formik.values.enrollment)} onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("enrollment", Number(e.target.value))} type="number"
            error={formik.touched.enrollment ? formik.errors.enrollment : undefined} className={inputClassname} disabled={formik.isSubmitting} />
          <CustomInput label="ID Período Académico" name="academic_period" value={String(formik.values.academic_period)}
            onBlur={formik.handleBlur} onChange={(e) => formik.setFieldValue("academic_period", Number(e.target.value))} type="number"
            error={formik.touched.academic_period ? formik.errors.academic_period : undefined} className={inputClassname} disabled={formik.isSubmitting} />
          <CustomSelect label="Tipo de Alerta" name="alert_type" value={formik.values.alert_type}
            onBlur={formik.handleBlur} onChange={(option) => formik.setFieldValue("alert_type", option.value)}
            error={formik.touched.alert_type ? formik.errors.alert_type : undefined}
            options={[{ label: "Seleccione un tipo", value: "" }, ...ALERT_TYPE_OPTIONS]} className={selectClassname} disabled={formik.isSubmitting} />
          <CustomInput label="Descripción" name="description" value={formik.values.description} onBlur={formik.handleBlur}
            onChange={formik.handleChange} type="text"
            error={formik.touched.description ? formik.errors.description : undefined} className={inputClassname} disabled={formik.isSubmitting} />
          <CustomSelect label="Nivel de Urgencia" name="urgency_level" value={formik.values.urgency_level}
            onBlur={formik.handleBlur} onChange={(option) => formik.setFieldValue("urgency_level", option.value)}
            error={formik.touched.urgency_level ? formik.errors.urgency_level : undefined}
            options={[{ label: "Seleccione un nivel", value: "" }, ...URGENCY_OPTIONS]} className={selectClassname} disabled={formik.isSubmitting} />
          <CustomInput label="Acciones de Respuesta" name="response_actions" value={formik.values.response_actions}
            onBlur={formik.handleBlur} onChange={formik.handleChange} type="text"
            error={formik.touched.response_actions ? formik.errors.response_actions : undefined} className={inputClassname} disabled={formik.isSubmitting} />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
              Cancelar
            </button>
            <button type="submit" disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              {formik.isSubmitting ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</> : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
