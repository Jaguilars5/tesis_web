import * as Yup from "yup";

export const recoveryProcessSchema = Yup.object({
  initial_grade: Yup.number().min(0).max(10).required("La nota inicial es obligatoria"),
  reinforcement_grade: Yup.number().min(0).max(10).nullable(),
  improvement_eval_grade: Yup.number().min(0).max(10).nullable(),
  final_calculated_grade: Yup.number().min(0).max(10).nullable(),
  family_notified: Yup.boolean(),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  end_date: Yup.string().nullable(),
  observations: Yup.string().nullable(),
  period_grade_summary: Yup.number().required("El resumen de calificaciones es obligatorio"),
  managed_by_user: Yup.number().required("El usuario gestor es obligatorio"),
  process_type: Yup.number().nullable(),
});
