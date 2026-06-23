import { useFormik } from "formik";
import { useEffect } from "react";

import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";

import { earlyAlertSchema } from "../early-alerts.utils";

import type { SubmitErrorState } from "../early-alerts.controller";
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

export const EarlyAlertFormModal = ({ isOpen, onClose, isEdit, editing, onSubmit, submitErrors }: EarlyAlertFormModalProps) => {
  const formik = useFormik<EarlyAlertFormValues>({
    initialValues: buildEditInitialValues(editing),
    enableReinitialize: true,
    validationSchema: earlyAlertSchema,
    onSubmit: async (values) => { await onSubmit(values); },
  });

  useEffect(() => { formik.setValues(buildEditInitialValues(editing)); }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

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
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <div className="mx-5 mt-3 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 size-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold text-red-800">Error al guardar la alerta</p>
                {submitErrors.general.length > 0 && (<ul className="mb-2 space-y-1">{submitErrors.general.map((err, i) => (<li key={i} className="text-sm text-red-700">• {err}</li>))}</ul>)}
                {Object.keys(submitErrors.validation).length > 0 && (
                  <ul className="space-y-1">{Object.entries(submitErrors.validation).map(([field, message]) => (
                    <li key={field} className="text-sm text-red-700"><span className="font-semibold">{getFieldLabel(field)}:</span> {message}</li>
                  ))}</ul>
                )}
              </div>
            </div>
          </div>
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
