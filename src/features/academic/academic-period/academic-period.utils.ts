import * as Yup from "yup";

import type { AcademicPeriodT } from "./academic-period.types";

export const academicPeriodSchema = Yup.object({
  code: Yup.string()
    .max(50, "El codigo no debe exceder 50 caracteres")
    .required("El codigo es obligatorio"),
  name: Yup.string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(80, "El nombre no debe exceder 80 caracteres")
    .required("El nombre es obligatorio"),
  period_type: Yup.number()
    .nullable()
    .transform((_, val) => (val === "" || val === 0 ? null : val)),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  end_date: Yup.string()
    .required("La fecha de fin es obligatoria")
    .test(
      "end_after_start",
      "La fecha de fin no puede ser anterior a la fecha de inicio",
      function (value) {
        const { start_date } = this.parent as { start_date?: string };
        if (!value || !start_date) return true;
        return value >= start_date;
      },
    ),
  year_weight: Yup.number()
    .nullable()
    .min(0, "El peso debe ser mayor o igual a 0")
    .max(100, "El peso no debe exceder 100")
    .transform((_, val) => (val === "" ? null : val)),
  is_regular_period: Yup.boolean(),
  is_active: Yup.boolean(),
  school_year: Yup.number()
    .min(1, "Debe seleccionar un ano escolar")
    .required("El ano escolar es obligatorio"),
});

export const formatAcademicPeriodName = (item: AcademicPeriodT): string =>
  item.name;

export const formatAcademicPeriodDateRange = (item: AcademicPeriodT): string =>
  `${item.start_date} - ${item.end_date}`;

export const buildAbbreviation = (name: string): string => {
  const cleaned = name.trim();
  if (!cleaned) return "";
  return cleaned
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .slice(0, 3);
};

export interface AcademicPeriodRangeOption {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

export const getTodayLocal = (): string => new Date().toISOString().slice(0, 10);

export const findAcademicPeriodByDate = (
  periods: AcademicPeriodRangeOption[],
  date: string,
): AcademicPeriodRangeOption | undefined =>
  periods.find(
    (p) =>
      p.startDate &&
      p.endDate &&
      date >= p.startDate &&
      date <= p.endDate,
  );
