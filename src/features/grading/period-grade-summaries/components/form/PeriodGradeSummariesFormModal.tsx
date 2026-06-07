import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";

import { periodGradeSummarySchema } from "../../presentation/utils/period-grade-summaries.validation";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";
import type { PeriodGradeSummaryFormValues } from "../../presentation/hooks/usePeriodGradeSummariesForm";

interface PeriodGradeSummariesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingPeriodGradeSummary: PeriodGradeSummaryT | null;
  onSubmit: (values: PeriodGradeSummaryFormValues) => Promise<void>;
  enrollmentOptions: SelectOptionT[];
  subjectOfferingOptions: SelectOptionT[];
  academicPeriodOptions: SelectOptionT[];
  qualitativeScaleOptions: SelectOptionT[];
  promotionStatusOptions: SelectOptionT[];
}

export const PeriodGradeSummariesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingPeriodGradeSummary,
  onSubmit,
  enrollmentOptions,
  subjectOfferingOptions,
  academicPeriodOptions,
  qualitativeScaleOptions,
  promotionStatusOptions,
}: PeriodGradeSummariesFormModalProps) => {
  const getInitialValues = (): PeriodGradeSummaryFormValues => {
    if (editingPeriodGradeSummary) {
      return {
        formative_avg: editingPeriodGradeSummary.formative_avg,
        summative_avg: editingPeriodGradeSummary.summative_avg,
        final_avg_truncated: editingPeriodGradeSummary.final_avg_truncated,
        requires_recovery: editingPeriodGradeSummary.requires_recovery,
        enrollment: editingPeriodGradeSummary.enrollment,
        subject_offering: editingPeriodGradeSummary.subject_offering,
        academic_period: editingPeriodGradeSummary.academic_period,
        qualitative_scale: editingPeriodGradeSummary.qualitative_scale,
        promotion_status: editingPeriodGradeSummary.promotion_status,
      };
    }
    return {
      formative_avg: 0,
      summative_avg: 0,
      final_avg_truncated: 0,
      requires_recovery: false,
      enrollment: 0,
      subject_offering: 0,
      academic_period: 0,
      qualitative_scale: null,
      promotion_status: null,
    };
  };

  const formik = useFormik<PeriodGradeSummaryFormValues>({
    initialValues: getInitialValues(),
    validationSchema: periodGradeSummarySchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingPeriodGradeSummary) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingPeriodGradeSummary]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Resumen de Calificaciones" : "Nuevo Resumen de Calificaciones"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el resumen de calificaciones del período
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomSelect
            label="Matrícula"
            name="enrollment"
            options={enrollmentOptions}
            value={formik.values.enrollment}
            onChange={(option) => formik.setFieldValue("enrollment", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.enrollment ? formik.errors.enrollment : undefined}
            className={selectClassname}
            placeholder="Seleccione una matrícula"
          />

          <CustomSelect
            label="Oferta de Materia"
            name="subject_offering"
            options={subjectOfferingOptions}
            value={formik.values.subject_offering}
            onChange={(option) => formik.setFieldValue("subject_offering", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.subject_offering ? formik.errors.subject_offering : undefined}
            className={selectClassname}
            placeholder="Seleccione una oferta"
          />

          <CustomSelect
            label="Período Académico"
            name="academic_period"
            options={academicPeriodOptions}
            value={formik.values.academic_period}
            onChange={(option) => formik.setFieldValue("academic_period", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.academic_period ? formik.errors.academic_period : undefined}
            className={selectClassname}
            placeholder="Seleccione un período"
          />

          <CustomInput
            label="Promedio Formativo"
            name="formative_avg"
            type="number"
            value={String(formik.values.formative_avg)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("formative_avg", Number(e.target.value))}
            error={formik.touched.formative_avg ? formik.errors.formative_avg : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Promedio Sumativo"
            name="summative_avg"
            type="number"
            value={String(formik.values.summative_avg)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("summative_avg", Number(e.target.value))}
            error={formik.touched.summative_avg ? formik.errors.summative_avg : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Promedio Final"
            name="final_avg_truncated"
            type="number"
            value={String(formik.values.final_avg_truncated)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("final_avg_truncated", Number(e.target.value))}
            error={formik.touched.final_avg_truncated ? formik.errors.final_avg_truncated : undefined}
            className={inputClassname}
          />

          <CustomSelect
            label="Escala Cualitativa"
            name="qualitative_scale"
            options={qualitativeScaleOptions}
            value={formik.values.qualitative_scale ?? 0}
            onChange={(option) => formik.setFieldValue("qualitative_scale", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.qualitative_scale ? formik.errors.qualitative_scale : undefined}
            className={selectClassname}
            placeholder="Seleccione una escala (opcional)"
          />

          <CustomSelect
            label="Estado de Promoción"
            name="promotion_status"
            options={promotionStatusOptions}
            value={formik.values.promotion_status ?? 0}
            onChange={(option) => formik.setFieldValue("promotion_status", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.promotion_status ? formik.errors.promotion_status : undefined}
            className={selectClassname}
            placeholder="Seleccione un estado (opcional)"
          />

          <div className="flex items-end pb-1">
            <CustomCheckbox
              name="requires_recovery"
              checked={formik.values.requires_recovery}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Requiere Recuperación"
              className={checkboxClassname}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
