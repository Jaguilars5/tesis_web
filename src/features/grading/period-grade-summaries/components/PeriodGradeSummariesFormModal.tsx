import { useFormik } from "formik";
import { X } from "lucide-react";
import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { periodGradeSummarySchema } from "../period-grade-summaries.utils";
import type { PeriodGradeSummaryFormValues, PeriodGradeSummaryT } from "../period-grade-summaries.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingPeriodGradeSummary: PeriodGradeSummaryT | null;
  onSubmit: (values: PeriodGradeSummaryFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
  enrollmentOptions: { label: string; value: string }[];
  subjectOfferingOptions: { label: string; value: string }[];
  academicPeriodOptions: { label: string; value: string }[];
  qualitativeScaleOptions: { label: string; value: string }[];
  promotionStatusOptions: { label: string; value: string }[];
}

const getFieldLabel = (field: string): string =>
  ({
    formative_avg: "Prom. formativo",
    summative_avg: "Prom. sumativo",
    final_avg_truncated: "Prom. final",
    enrollment: "Matrícula",
    subject_offering: "Oferta",
    academic_period: "Período",
    qualitative_scale: "Escala cualitativa",
    promotion_status: "Estado promoción",
    non_field_errors: "Error general",
  })[field] || field;

const getInitialValues = (
  editing?: PeriodGradeSummaryT | null,
): PeriodGradeSummaryFormValues => {
  if (editing)
    return {
      formative_avg: editing.formative_avg,
      summative_avg: editing.summative_avg,
      final_avg_truncated: editing.final_avg_truncated,
      is_failing: editing.is_failing,
      enrollment: editing.enrollment,
      subject_offering: editing.subject_offering,
      academic_period: editing.academic_period,
      qualitative_scale: editing.qualitative_scale,
      promotion_status: editing.promotion_status,
    };
  return {
    formative_avg: 0,
    summative_avg: 0,
    final_avg_truncated: 0,
    is_failing: false,
    enrollment: 0,
    subject_offering: 0,
    academic_period: 0,
    qualitative_scale: null,
    promotion_status: "",
  };
};

export const PeriodGradeSummariesFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingPeriodGradeSummary,
  onSubmit,
  submitErrors,
  enrollmentOptions,
  subjectOfferingOptions,
  academicPeriodOptions,
  qualitativeScaleOptions,
  promotionStatusOptions,
}) => {
  const formik = useFormik<PeriodGradeSummaryFormValues>({
    initialValues: getInitialValues(editingPeriodGradeSummary),
    validationSchema: periodGradeSummarySchema,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nuevo"} Resumen
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el resumen de calificaciones
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-3 gap-4">
            <CustomInput
              label="Prom. Formativo"
              name="formative_avg"
              type="number"
              value={String(formik.values.formative_avg)}
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue("formative_avg", Number(e.target.value))
              }
              error={
                formik.touched.formative_avg
                  ? formik.errors.formative_avg
                  : undefined
              }
              className={inputClassname}
            />
            <CustomInput
              label="Prom. Sumativo"
              name="summative_avg"
              type="number"
              value={String(formik.values.summative_avg)}
              onChange={(e) =>
                formik.setFieldValue("summative_avg", Number(e.target.value))
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.summative_avg
                  ? formik.errors.summative_avg
                  : undefined
              }
              className={inputClassname}
            />
            <CustomInput
              label="Prom. Final"
              name="final_avg_truncated"
              type="number"
              value={String(formik.values.final_avg_truncated)}
              onChange={(e) =>
                formik.setFieldValue(
                  "final_avg_truncated",
                  Number(e.target.value),
                )
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.final_avg_truncated
                  ? formik.errors.final_avg_truncated
                  : undefined
              }
              className={inputClassname}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Matrícula"
              name="enrollment"
              value={formik.values.enrollment}
              onChange={(option) =>
                formik.setFieldValue("enrollment", Number(option.value))
              }
              options={enrollmentOptions}
              className={selectClassname}
              error={
                formik.touched.enrollment
                  ? formik.errors.enrollment
                  : undefined
              }
            />
            <CustomSelect
              label="Oferta"
              name="subject_offering"
              value={formik.values.subject_offering}
              onChange={(option) =>
                formik.setFieldValue(
                  "subject_offering",
                  Number(option.value),
                )
              }
              options={subjectOfferingOptions}
              className={selectClassname}
              error={
                formik.touched.subject_offering
                  ? formik.errors.subject_offering
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Período"
              name="academic_period"
              value={formik.values.academic_period}
              onChange={(option) =>
                formik.setFieldValue("academic_period", Number(option.value))
              }
              options={academicPeriodOptions}
              className={selectClassname}
              error={
                formik.touched.academic_period
                  ? formik.errors.academic_period
                  : undefined
              }
            />
            <CustomSelect
              label="Escala Cualitativa"
              name="qualitative_scale"
              value={formik.values.qualitative_scale ?? ""}
              onChange={(option) =>
                formik.setFieldValue(
                  "qualitative_scale",
                  option.value ? Number(option.value) : null,
                )
              }
              options={qualitativeScaleOptions}
              className={selectClassname}
              error={
                formik.touched.qualitative_scale
                  ? formik.errors.qualitative_scale
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Estado Promoción"
              name="promotion_status"
              value={formik.values.promotion_status}
              onChange={(option) =>
                formik.setFieldValue("promotion_status", option.value)
              }
              options={promotionStatusOptions}
              className={selectClassname}
              error={
                formik.touched.promotion_status
                  ? formik.errors.promotion_status
                  : undefined
              }
            />
            <CustomCheckbox
              name="is_failing"
              checked={formik.values.is_failing}
              onChange={() =>
                formik.setFieldValue(
                  "is_failing",
                  !formik.values.is_failing,
                )
              }
              label="Está Reprobando"
              className={checkboxClassname}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {formik.isSubmitting && (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isEdit ? "Guardar Cambios" : "Crear Resumen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
