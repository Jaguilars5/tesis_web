import * as Yup from "yup";

export const simulateSchema = Yup.object({
  attendance_rate: Yup.number()
    .min(0, "La asistencia no puede ser menor a 0%")
    .max(100, "La asistencia no puede ser mayor a 100%")
    .required("Requerido"),
  average_grade: Yup.number()
    .min(0, "El promedio no puede ser menor a 0")
    .max(10, "El promedio no puede ser mayor a 10")
    .required("Requerido"),
  failing_subjects_count: Yup.number()
    .min(0, "No puede ser negativo")
    .integer("Debe ser entero")
    .required("Requerido"),
  severe_incidents_count: Yup.number()
    .min(0, "No puede ser negativo")
    .integer("Debe ser entero")
    .required("Requerido"),
  mild_incidents_count: Yup.number()
    .min(0, "No puede ser negativo")
    .integer("Debe ser entero")
    .required("Requerido"),
  moderate_incidents_count: Yup.number().min(0).integer().default(0),
  consecutive_absences_max: Yup.number().min(0).integer().default(0),
  tardiness_count: Yup.number().min(0).integer().default(0),
  justified_absences: Yup.number().min(0).integer().default(0),
  unjustified_absences: Yup.number().min(0).integer().default(0),
  grade_trend_slope: Yup.number().default(0),
  family_notified_ratio: Yup.number().min(0).max(1).default(0),
  prev_period_avg_grade: Yup.number().min(0).max(10).default(0),
  age_grade_gap: Yup.number().min(0).integer().default(0),
  is_repeat: Yup.boolean().default(false),
  has_special_needs: Yup.boolean().default(false),
});
