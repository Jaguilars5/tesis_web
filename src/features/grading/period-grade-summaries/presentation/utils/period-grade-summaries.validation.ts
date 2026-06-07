import * as Yup from "yup";

export const periodGradeSummarySchema = Yup.object({
  formative_avg: Yup.number().min(0).max(10).required("El promedio formativo es obligatorio"),
  summative_avg: Yup.number().min(0).max(10).required("El promedio sumativo es obligatorio"),
  final_avg_truncated: Yup.number().min(0).max(10).required("El promedio final es obligatorio"),
  requires_recovery: Yup.boolean(),
  enrollment: Yup.number().required("La matrícula es obligatoria"),
  subject_offering: Yup.number().required("La oferta de materia es obligatoria"),
  academic_period: Yup.number().required("El período académico es obligatorio"),
  qualitative_scale: Yup.number().nullable(),
  promotion_status: Yup.number().nullable(),
});
