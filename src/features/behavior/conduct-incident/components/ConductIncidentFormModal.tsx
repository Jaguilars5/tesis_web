import { useFormik } from "formik";
import { X } from "lucide-react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";

import { conductIncidentSchema } from "../conduct-incident.utils";

import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { ConductIncidentFormValues, ConductIncidentT } from "../conduct-incident.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    incident_type: "Tipo de incidente",
    severity: "Severidad",
    academic_period: "Período académico",
    enrollment: "Matrícula",
    incident_date: "Fecha",
    description: "Descripción",
    actions_taken: "Acciones tomadas",
    family_notified: "Familia notificada",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface ConductIncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingIncident: ConductIncidentT | null;
  onSubmit: (values: ConductIncidentFormValues) => Promise<void>;
  submitErrors?: SubmitErrorState;
  incidentTypeOptions: { label: string; value: string }[];
  severityOptions: { label: string; value: string }[];
  academicPeriodOptions: { label: string; value: string }[];
  enrollmentOptions: { label: string; value: string }[];
}

export const ConductIncidentFormModal: React.FC<ConductIncidentFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingIncident,
  onSubmit,
  submitErrors = { general: [], validation: {} },
  incidentTypeOptions,
  severityOptions,
  academicPeriodOptions,
  enrollmentOptions,
}) => {
  const getInitialValues = (): ConductIncidentFormValues => {
    if (editingIncident) {
      return {
        incident_type: editingIncident.incident_type,
        severity: editingIncident.severity,
        academic_period: editingIncident.academic_period,
        enrollment: editingIncident.enrollment,
        incident_date: editingIncident.incident_date,
        description: editingIncident.description,
        actions_taken: editingIncident.actions_taken,
        family_notified: editingIncident.family_notified,
      };
    }
    return {
      incident_type: null,
      severity: null,
      academic_period: null,
      enrollment: null,
      incident_date: "",
      description: "",
      actions_taken: "",
      family_notified: false,
    };
  };

  const formik = useFormik<ConductIncidentFormValues>({
    initialValues: getInitialValues(),
    validationSchema: conductIncidentSchema,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{isEdit ? "Editar Incidente" : "Nuevo Incidente"}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{isEdit ? "Actualice los datos" : "Reporte un nuevo incidente de conducta"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect label="Tipo de Incidente" name="incident_type" value={formik.values.incident_type ?? ""} onBlur={formik.handleBlur} onChange={(o) => formik.setFieldValue("incident_type", o.value ? Number(o.value) : null)} error={formik.touched.incident_type ? formik.errors.incident_type : undefined} options={incidentTypeOptions} className={selectClassname} />
            <CustomSelect label="Severidad" name="severity" value={formik.values.severity ?? ""} onBlur={formik.handleBlur} onChange={(o) => formik.setFieldValue("severity", o.value ? Number(o.value) : null)} error={formik.touched.severity ? formik.errors.severity : undefined} options={severityOptions} className={selectClassname} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect label="Matrícula" name="enrollment" value={formik.values.enrollment ?? ""} onBlur={formik.handleBlur} onChange={(o) => formik.setFieldValue("enrollment", o.value ? Number(o.value) : null)} error={formik.touched.enrollment ? formik.errors.enrollment : undefined} options={enrollmentOptions} className={selectClassname} />
            <CustomSelect label="Período Académico" name="academic_period" value={formik.values.academic_period ?? ""} onBlur={formik.handleBlur} onChange={(o) => formik.setFieldValue("academic_period", o.value ? Number(o.value) : null)} error={formik.touched.academic_period ? formik.errors.academic_period : undefined} options={academicPeriodOptions} className={selectClassname} />
          </div>
          <CustomInput label="Fecha del Incidente" name="incident_date" type="date" value={formik.values.incident_date} onBlur={formik.handleBlur} onChange={formik.handleChange} error={formik.touched.incident_date ? formik.errors.incident_date : undefined} className={inputClassname} />
          <CustomInput label="Descripción" name="description" placeholder="Describa el incidente..." value={formik.values.description} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.description ? formik.errors.description : undefined} className={inputClassname} />
          <CustomInput label="Acciones Tomadas" name="actions_taken" placeholder="Acciones realizadas..." value={formik.values.actions_taken} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.actions_taken ? formik.errors.actions_taken : undefined} className={inputClassname} />
          <CustomCheckbox name="family_notified" checked={formik.values.family_notified} onChange={formik.handleChange} onBlur={formik.handleBlur} label="Familia Notificada" className={checkboxClassname} />
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={formik.isSubmitting} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              {formik.isSubmitting ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</> : isEdit ? "Actualizar" : "Reportar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
