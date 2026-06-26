import * as Yup from "yup";

export const behaviorEvaluationSchema = Yup.object({
  final_scale: Yup.number().nullable().required("La escala final es requerida"),
  override_reason: Yup.string()
    .required("La razón de anulación es requerida")
    .min(10, "Debe tener al menos 10 caracteres"),
  general_observation: Yup.string(),
});

export const behaviorEvaluationCalculateSchema = Yup.object({
  enrollment_id: Yup.number().nullable().required("La matrícula es requerida"),
  academic_period_id: Yup.number()
    .nullable()
    .required("El período académico es requerido"),
});

export const formatEvaluationDate = (evaluation: {
  evaluation_date: string;
}): string => evaluation.evaluation_date ?? "Sin fecha";
export const formatApprovalStatus = (evaluation: {
  approval_date: string | null;
}): string => (evaluation.approval_date ? "Aprobado" : "Pendiente");
