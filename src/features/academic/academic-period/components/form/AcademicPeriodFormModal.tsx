import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import {
  CustomCheckbox,
  CustomInput,
  CustomSelect,
} from "@shared/components/Form";

import { academicPeriodSchema } from "../../presentation/utils/academic-period.validation";
import { ACADEMIC_PERIOD_TYPE_OPTIONS } from "../../constants/academic-period.constants";

import type { AcademicPeriodT, PeriodTypeEnum } from "../../domain/entities/academic-period.types";

interface AcademicPeriodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingAcademicPeriod: AcademicPeriodT | null;
  onSubmit: (values: AcademicPeriodFormValues) => Promise<void>;
}

export interface AcademicPeriodFormValues {
  name: string;
  period_type: PeriodTypeEnum;
  start_date: string;
  end_date: string;
  is_regular_period: boolean;
  school_year: number;
  is_active: boolean;
}

export const AcademicPeriodFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingAcademicPeriod,
  onSubmit,
}: AcademicPeriodFormModalProps) => {
  const getInitialValues = (): AcademicPeriodFormValues => {
    if (editingAcademicPeriod) {
      return {
        name: editingAcademicPeriod.name,
        period_type: editingAcademicPeriod.period_type,
        start_date: editingAcademicPeriod.start_date,
        end_date: editingAcademicPeriod.end_date,
        is_regular_period: editingAcademicPeriod.is_regular_period,
        school_year: editingAcademicPeriod.school_year,
        is_active: editingAcademicPeriod.is_active,
      };
    }
    return {
      name: "",
      period_type: "REGULAR" as PeriodTypeEnum,
      start_date: "",
      end_date: "",
      is_regular_period: true,
      school_year: 0,
      is_active: true,
    };
  };

  const formik = useFormik<AcademicPeriodFormValues>({
    initialValues: getInitialValues(),
    validationSchema: academicPeriodSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingAcademicPeriod) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingAcademicPeriod]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit
                ? "Editar Periodo Academico"
                : "Nuevo Periodo Academico"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el periodo de evaluacion
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
          <CustomInput
            label="Nombre del Periodo"
            name="name"
            placeholder="Primer Trimestre"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Tipo de Periodo"
              name="period_type"
              value={formik.values.period_type}
              onBlur={formik.handleBlur}
              onChange={(option) =>
                formik.setFieldValue("period_type", option.value)
              }
              error={
                formik.touched.period_type
                  ? formik.errors.period_type
                  : undefined
              }
              options={ACADEMIC_PERIOD_TYPE_OPTIONS.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              className={selectClassname}
            />

            <CustomInput
              label="Año Escolar"
              name="school_year"
              type="number"
              value={formik.values.school_year}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.school_year
                  ? formik.errors.school_year
                  : undefined
              }
              className={inputClassname}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Fecha de Inicio"
              name="start_date"
              type="date"
              value={formik.values.start_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.start_date
                  ? formik.errors.start_date
                  : undefined
              }
              className={inputClassname}
            />

            <CustomInput
              label="Fecha de Fin"
              name="end_date"
              type="date"
              value={formik.values.end_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.end_date ? formik.errors.end_date : undefined
              }
              className={inputClassname}
            />
          </div>

          <div className="flex items-end pb-1">
            <CustomCheckbox
              name="is_regular_period"
              checked={formik.values.is_regular_period}
              onChange={(e) =>
                formik.setFieldValue("is_regular_period", e.target.checked)
              }
              onBlur={formik.handleBlur}
              label="Periodo Regular"
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
