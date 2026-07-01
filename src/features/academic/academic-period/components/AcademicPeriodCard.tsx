import { useFormik } from "formik";
import { useEffect } from "react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import { academicPeriodSchema } from "../academic-period.utils";

import type { AcademicPeriodFormValues } from "../academic-period.types";

interface AcademicPeriodCardProps {
  index: number;
  total: number;
  initialValues: AcademicPeriodFormValues;
  disabled?: boolean;
  onChange: (values: AcademicPeriodFormValues) => void;
}

export const AcademicPeriodCard: React.FC<AcademicPeriodCardProps> = ({
  index,
  total,
  initialValues,
  disabled = false,
  onChange,
}) => {
  const formik = useFormik<AcademicPeriodFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: academicPeriodSchema,
    onSubmit: () => undefined,
  });

  useEffect(() => {
    onChange(formik.values);
  }, [
    formik.values.code,
    formik.values.name,
    formik.values.start_date,
    formik.values.end_date,
    formik.values.year_weight,
    formik.values.is_regular_period,
  ]);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">
          Periodo {index + 1} de {total}
        </h4>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Editable
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CustomInput
          id={`name-${index}`}
          label="Nombre"
          name="name"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={formik.touched.name ? formik.errors.name : undefined}
          className={inputClassname}
          disabled={disabled}
        />
        <CustomInput
          id={`code-${index}`}
          label="Codigo"
          name="code"
          value={formik.values.code}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={formik.touched.code ? formik.errors.code : undefined}
          className={inputClassname}
          disabled={disabled}
        />
        <CustomInput
          id={`year_weight-${index}`}
          label="Peso (%)"
          name="year_weight"
          type="number"
          value={formik.values.year_weight ?? ""}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.touched.year_weight ? formik.errors.year_weight : undefined
          }
          className={inputClassname}
          disabled={disabled}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CustomInput
          id={`start_date-${index}`}
          label="Fecha de Inicio"
          name="start_date"
          type="date"
          value={formik.values.start_date}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.touched.start_date ? formik.errors.start_date : undefined
          }
          className={inputClassname}
          disabled={disabled}
        />
        <CustomInput
          id={`end_date-${index}`}
          label="Fecha de Fin"
          name="end_date"
          type="date"
          min={formik.values.start_date}
          value={formik.values.end_date}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.end_date ? formik.errors.end_date : undefined}
          className={inputClassname}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
